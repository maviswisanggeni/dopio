import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    units: [],
    isLoading: false,
  },
  getters: {
    unitOptions(state) {
      return state.units.map(unit => ({ label: unit.name, value: unit.id }));
    },
  },
  mutations: {
    setUnits: (state, units) => (state.units = units),
    addUnit: (state, unit) => {
      state.units.unshift(unit);
      state.units.sort((a, b) => a.name.localeCompare(b.name));
    },
    updateUnit: (state, unit) => findAndUpdate(state.units, unit),
    deleteUnit: (state, unit) => findAndDelete(state.units, unit),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      const { $axios } = that;
      const res = await $axios.get('unit');
      commit('setUnits', res.data);
    },
    async create({ commit }, that) {
      const { unit, $axios } = that;
      const res = await $axios.post(`unit`, unit);
      commit('addUnit', res.data);
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { unit, $axios } = that;
        const res = await $axios.get(`unit/${unit.id}`);
        const unitUpdated = res.data;
        commit('updateUnit', unitUpdated);
        return unitUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async update({ commit }, that) {
      const { unit, $axios } = that;
      const res = await $axios.put(`unit/${unit.id}`, unit);
      commit('updateUnit', res.data);
    },
    async destroy({ commit }, that) {
      const { unit, $axios } = that;
      await $axios.delete(`unit/${unit.id}`);
      commit('deleteUnit', unit);
    },
  },
};
