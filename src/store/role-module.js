import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    roles: [],
    isLoading: false,
    permissions: [
      { label: 'Back Office', value: 'BACK_OFFICE', description: 'Dapat mengakses bagian admin' },
      { label: 'Point of Sale', value: 'POS', description: 'Dapat melakakukan penjualan' },
      { label: 'Laporan', value: 'REPORT', description: 'Dapat mengakses laporan' },
      { label: 'Authentikasi', value: 'AUTH', description: 'Dapat mengubah posisi & hak akses pengguna' },
    ],
  },
  mutations: {
    setRoles: (state, roles) => (state.roles = roles),
    addRole: (state, role) => state.roles.push(role),
    updateRole: (state, role) => findAndUpdate(state.roles, role),
    deleteRole: (state, role) => findAndDelete(state.roles, role),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('role');
        commit('setRoles', res.data);
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { role, $axios } = that;
        const res = await $axios.get(`role/${role.id}`);
        const roleUpdated = res.data;
        commit('updateRole', roleUpdated);
        return roleUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { role, $axios } = that;
      const payloadRole = { ...role };
      payloadRole.permissions = payloadRole.permissions.filter(pm => pm.isSelected).map(pm => pm.value);
      const res = await $axios.post('role', payloadRole);
      commit('addRole', res.data);
    },
    async update({ commit }, that) {
      const { role, $axios } = that;
      const payloadRole = { ...role };
      payloadRole.permissions = payloadRole.permissions.filter(pm => pm.isSelected).map(pm => pm.value);
      const res = await $axios.put(`role/${role.id}`, payloadRole);
      commit('updateRole', res.data);
    },
    async toogleActive({ commit }, that) {
      const { role, $axios, isActive } = that;
      commit('updateRole', { ...role, isActive });
      await $axios.put(`role/${role.id}`, { isActive });
    },
    async destroy({ commit }, that) {
      const { role, $axios } = that;
      await $axios.delete(`role/${role.id}`);
      commit('deleteRole', role);
    },
  },
};
