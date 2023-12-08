import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    suppliers: [],
    isLoading: false,
  },
  mutations: {
    setSuppliers: (state, suppliers) => (state.suppliers = suppliers),
    addSupplier: (state, supplier) => state.suppliers.push(supplier),
    updateSupplier: (state, supplier) => findAndUpdate(state.suppliers, supplier),
    deleteSupplier: (state, supplier) => findAndDelete(state.suppliers, supplier),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('supplier');
        commit('setSuppliers', res.data);
        return res.data;
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { supplier, $axios } = that;
        const res = await $axios.get(`supplier/${supplier.id}`);
        const supplierUpdated = res.data;
        commit('updateSupplier', supplierUpdated);
        return supplierUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { supplier, $axios } = that;
      const res = await $axios.post('supplier', supplier);
      commit('addSupplier', res.data);
    },
    async update({ commit }, that) {
      const { supplier, $axios } = that;
      const res = await $axios.put(`supplier/${supplier.id}`, supplier);
      const supplierUpdated = res.data;
      commit('updateSupplier', supplierUpdated);
      return supplierUpdated;
    },
    async destroy({ commit }, that) {
      const { supplier, $axios } = that;
      await $axios.delete(`supplier/${supplier.id}`);
      commit('deleteSupplier', supplier);
    },
  },
};
