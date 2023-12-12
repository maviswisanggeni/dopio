import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    categories: [],
  },
  getters: {
    option(state) {
      return state.categories.map(category => ({ label: category.name, value: category.id }));
    },
  },
  mutations: {
    setCategories: (state, categories) => (state.categories = categories),
    addCategory: (state, category) => state.categories.push(category),
    updateCategory: (state, category) => findAndUpdate(state.categories, category),
    deleteCategory: (state, category) => findAndDelete(state.categories, category),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('category');
        commit('setCategories', res.data);
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { category, $axios } = that;
        const res = await $axios.get(`category/${category.id}`);
        const categoryUpdated = res.data;
        commit('updateCategory', categoryUpdated);
        return categoryUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { category, $axios } = that;
      const payload = { name: category.name, productIds: category.productIds };
      const res = await $axios.post('category', payload);
      commit('addCategory', res.data);
    },
    async update({ commit }, that) {
      const { category, $axios } = that;
      const payload = { name: category.name, productIds: category.productIds };
      const res = await $axios.put(`category/${category.id}`, payload);
      commit('updateCategory', res.data);
    },
    async destroy({ commit }, that) {
      const { category, $axios } = that;
      await $axios.delete(`category/${category.id}`);
      commit('deleteCategory', category);
    },
  },
};
