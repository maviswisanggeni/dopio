import { excludeEmpty } from 'src/helpers/object.helper';
import { findAndUpdate } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    cashes: [],
    params: {},
    isLoading: false
  },
  mutations: {
    setCashes: (state, cashes) => (state.cashes = cashes),
    setParam: (state, params) => (state.params = params),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
    updateCash: (state, cash) => findAndUpdate(state.cashes, cash)
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { pagination, filter, $axios } = that;
        const { page, rowsPerPage } = pagination;
        const paginate = { limit: rowsPerPage, page };
        const params = { ...paginate, ...excludeEmpty(filter) };
        const res = await $axios.get('cash', { params });
        commit('setParam', params);
        commit('setCashes', res.data.items);
        return res.data;
      } finally {
        commit('setLoading', false);
      }
    },
    async refresh({ commit, state }, that) {
      const { $axios } = that;
      const { params } = state;
      commit('setLoading', true);
      try {
        const res = await $axios.get('cash', { params });
        commit('setCashes', res.data.items);
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { idCash, $axios } = that;
        const res = await $axios.get(`cash/${idCash}`);
        const cash = res.data;
        commit('updateCash', cash);
        return cash;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { cash, $axios } = that;
      await $axios.post('cash', cash);
    },
    async update({ commit }, that) {
      const { cash, $axios } = that;
      await $axios.put(`cash/${cash.id}`, cash);
    },
    async destroy({ commit }, that) {
      const { cash, $axios } = that;
      await $axios.delete(`cash/${cash.id}`);
    }
  }
};
