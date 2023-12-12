import { excludeEmpty } from 'src/helpers/object.helper';
import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    sales: [],
    params: {},
    isLoading: false,
  },
  mutations: {
    setSales: (state, sales) => (state.sales = sales),
    setParam: (state, params) => (state.params = params),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
    updateSale: (state, sale) => findAndUpdate(state.sales, sale),
    deleteSale: (state, sale) => findAndDelete(state.sales, sale),
    createOrUpdateSale: (state, sale) => {
      const index = findAndUpdate(state.sales, sale);
      if (index < 0) return state.sales.unshift(sale);
    },
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { pagination, filter, $axios } = that;
        const { page, rowsPerPage } = pagination;
        const paginate = { limit: rowsPerPage, page };
        const params = { ...paginate, ...excludeEmpty(filter) };
        const mode = params.mode ? params.mode.split(':') : null;
        if (mode) params[mode[0]] = mode[1];
        delete params.mode;

        const res = await $axios.get('sale', { params });
        commit('setParam', params);
        commit('setSales', res.data.items);
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
        const res = await $axios.get('sale', { params });
        commit('setSales', res.data.items);
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios, sale } = that;
        const res = await $axios.get(`sale/${sale.id}`);
        const saleUpdated = res.data;
        commit('updateSale', saleUpdated);
        return saleUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async update({ commit }, that) {
      const { sale, $axios } = that;
      const saleUpdated = await $axios.put(`sale/${sale.id}`, sale);
      commit('updateSale', saleUpdated);
    },
    async destroy({ commit }, that) {
      const { sale, $axios } = that;
      await $axios.delete(`sale/${sale.id}`);
      commit('deleteSale', sale);
    },
  },
};
