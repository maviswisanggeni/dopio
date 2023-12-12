import Vue from 'vue';
import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    ingredients: [],
    isLoading: false,
  },
  getters: {},
  mutations: {
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
    setIngredients: (state, ingredients) => (state.ingredients = ingredients),
    addIngredient: (state, ingredient) => {
      state.ingredients.push(ingredient);
      state.ingredients.sort((a, b) => a.name.localeCompare(b.name));
    },
    updateIngredient: (state, ingredient) => findAndUpdate(state.ingredients, ingredient),
    deleteIngredient: (state, ingredient) => findAndDelete(state.ingredients, ingredient),
    updateStockIngredients: (state, ingredients) => {
      for (const ingredient of ingredients) {
        const index = state.ingredients.findIndex(item => item.id == ingredient.id);
        if (index < 0) return;
        const stateIngredient = state.ingredients[index];
        stateIngredient.stock = ingredient.stock;
        Vue.set(state.ingredients, index, stateIngredient);
      }
    },
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('ingredient');
        commit('setIngredients', res.data);
        return res.data;
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { ingredient, $axios } = that;
        const res = await $axios.get(`ingredient/${ingredient.id}`);
        const ingredientUpdated = res.data;
        commit('updateIngredient', ingredientUpdated);
        return ingredientUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { ingredient, $axios } = that;
      const res = await $axios.post('ingredient', ingredient);
      commit('addIngredient', res.data);
    },
    async update({ commit }, that) {
      const { ingredient, $axios } = that;
      const res = await $axios.put(`ingredient/${ingredient.id}`, ingredient);
      commit('updateIngredient', res.data);
    },
    async destroy({ commit }, that) {
      const { ingredient, $axios } = that;
      await $axios.delete(`ingredient/${ingredient.id}`);
      commit('deleteIngredient', ingredient);
    },
  },
};
