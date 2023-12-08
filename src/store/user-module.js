import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    users: [],
    isLoading: false,
  },
  mutations: {
    setUsers: (state, users) => (state.users = users),
    addUser: (state, user) => state.users.push(user),
    updateUser: (state, user) => findAndUpdate(state.users, user),
    deleteUser: (state, user) => findAndDelete(state.users, user),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('user');
        commit('setUsers', res.data);
        return res.data;
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { user, $axios } = that;
        const res = await $axios.get(`user/${user.id}`);
        const userUpdated = res.data;
        commit('updateUser', userUpdated);
        return userUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async findByPhoneNumber({ commit }, that) {
      const { user, $axios } = that;
      const phone = user.phone.replace('0', '+62');
      const res = await $axios.get(`user/${phone}/phone`);
      return res.data;
    },
    async create({ commit }, that) {
      const { user, $axios } = that;
      const payloadUser = { ...user };
      payloadUser.phone = payloadUser.phone.replace('0', '+62');
      const res = await $axios.post('user', payloadUser);
      commit('addUser', res.data);
    },
    async invite({ commit }, that) {
      const { user, $axios } = that;
      const payloadUserInvite = { phone: user.phone.replace('0', '+62'), roleId: user.roleId };
      const res = await $axios.patch('user/invite', payloadUserInvite);
      commit('addUser', res.data);
    },
    async update({ commit }, that) {
      const { user, $axios } = that;
      const res = await $axios.put(`user/${user.id}`, user);
      const userUpdated = res.data;
      userUpdated.roleId = userUpdated.role.id;
      commit('updateUser', userUpdated);
      return userUpdated;
    },
    async kick({ commit }, that) {
      const { user, $axios } = that;
      await $axios.patch(`user/${user.id}/kick`);
      commit('deleteUser', user);
    },
  },
};
