import { LocalStorage } from 'quasar';

export default {
  namespaced: true,
  state: {
    user: LocalStorage.getItem('user') || '',
    token: LocalStorage.getItem('token') || '',
    company: LocalStorage.getItem('company') || '',
  },
  getters: {
    isAuthenticated: state => !!state.token,
    permissions(state) {
      return state.user.role.permissions;
    },
    isTaxEnabled(state) {
      return state.company.isTaxEnabled;
    },
  },
  mutations: {
    setAuth(state, payload) {
      const { user, company } = payload;
      state.user = user;
      state.company = company;
      delete user.company;
      LocalStorage.set('user', state.user);
      LocalStorage.set('company', state.company);
    },
    setToken(state, payload) {
      const { token } = payload;
      state.token = token;
      LocalStorage.set('token', state.token);
    },
    updateUser(state, payload) {
      state.user = payload;
    },
    updateCompany(state, company) {
      state.company = company;
    },
    clear(state) {
      state.company = {};
      state.user = {};
      state.token = '';
      LocalStorage.set('token', state.token);
      LocalStorage.set('user', state.user);
    },
  },
  actions: {
    async login({ commit }, that) {
      const { $axios, phone, password } = that;
      const res = await $axios.post('auth/login', { phone, password });
      const user = res.data;
      const { token, company } = user;
      if (!user.role.permissions.includes('BACK_OFFICE')) throw Error('Anda tidak mempunyai akses ke menu backend office dopio');
      $axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      commit('setAuth', { user, company });
      commit('setToken', { token });
    },
    async logout({ commit }, that) {
      const { $axios } = that;
      await $axios.post('auth/logout');
      commit('clear');
      $axios.defaults.headers.common['Authorization'] = null;
    },
    async refresh({ commit }, that) {
      const { $axios } = that;
      const res = await $axios.post('auth/refresh');
      const { token } = res.data;
      $axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      commit('setToken', { token });
    },
    async me({ commit }, that) {
      const { $axios } = that;
      const res = await $axios.get('auth/me', { params: { withCompany: true } });
      const user = res.data;
      commit('setAuth', { user, company: user.company });
    },
    async updateUser({ commit }, that) {
      const { $axios, user } = that;
      const res = await $axios.put('user/me', user);
      commit('updateUser', res.data);
    },
    async changePassword({ commit }, that) {
      const { $axios } = that;
      const payload = { oldPassword: that.oldPassword, newPassword: that.newPassword, confirmNewPassword: that.confirmNewPassword };
      await $axios.patch('auth/change-password', payload);
    },
    async updateCompany({ commit }, that) {
      const { $axios, company } = that;
      const res = await $axios.put('company', company);
      commit('updateCompany', res.data);
    },
    async updateLogo({ commit }, that) {
      const form = new FormData();
      const { $axios, company } = that;
      if (company.logo instanceof Blob) form.append('logo', company.logo);
      if (company.logo == null) form.append('logo', company.logo);
      if (!form.has('logo')) return;
      await $axios.put('company/logo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
  },
};
