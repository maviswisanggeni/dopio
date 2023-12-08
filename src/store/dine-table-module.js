import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    dineTables: [],
    isLoading: false
  },
  mutations: {
    setDineTable: (state, dineTables) => (state.dineTables = dineTables),
    addDineTable: (state, dineTable) => state.dineTables.push(...dineTable),
    updateDineTable: (state, dineTable) => findAndUpdate(state.dineTables, dineTable),
    deleteDineTable: (state, dineTable) => findAndDelete(state.dineTables, dineTable),
    setLoading: (state, isLoading) => (state.isLoading = isLoading)
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('dine-table');
        const dineTables = res.data;
        commit('setDineTable', dineTables);
        return dineTables;
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { dineTable, $axios } = that;
        const res = await $axios.get(`dine-table/${dineTable.id}`);
        const dineTableUpdated = res.data;
        commit('updateDineTable', dineTableUpdated);
        return dineTableUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { dineTableGenerate, $axios } = that;
      const res = await $axios.post('dine-table', dineTableGenerate);
      commit('addDineTable', res.data);
    },
    async update({ commit }, that) {
      const { dineTable, $axios } = that;
      const res = await $axios.put(`dine-table/${dineTable.id}`, dineTable);
      commit('updateDineTable', res.data);
    },
    async destroy({ commit }, that) {
      const { dineTable, $axios } = that;
      await $axios.delete(`dine-table/${dineTable.id}`);
      commit('deleteDineTable', dineTable);
    }
  }
};
