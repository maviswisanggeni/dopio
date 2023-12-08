import { add, findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    extras: [],
  },
  getters: {
    option(state) {
      return state.extras.map(extra => ({ label: extra.name, value: extra.id }));
    },
  },
  mutations: {
    setExtras: (state, extras) => (state.extras = extras),
    addExtra: (state, extra) => add(state.extras, extra),
    updateExtra: (state, extra) => findAndUpdate(state.extras, extra),
    deleteExtra: (state, extra) => findAndDelete(state.extras, extra),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      const { $axios } = that;
      const res = await $axios.get('extra');
      commit('setExtras', res.data);
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { extra, $axios } = that;
        const res = await $axios.get(`extra/${extra.id}`);
        const extraUpdated = res.data;
        commit('updateExtra', extraUpdated);
        return extraUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { extra, $axios } = that;
      const form = new FormData();
      form.append('name', extra.name);
      form.append('price', extra.price);
      if (extra.image == null) form.append('image', null);
      if (extra.image instanceof Blob) form.append('image', extra.image);
      for (const [i, ei] of extra.extraIngredients.entries()) {
        form.append(`extraIngredients[${i}][ingredientId]`, ei.ingredientId);
        form.append(`extraIngredients[${i}][qty]`, ei.qty);
      }
      const res = await $axios.post('extra', form);
      commit('addExtra', res.data);
    },
    async update({ commit }, that) {
      const { extra, $axios } = that;
      const form = new FormData();
      form.append('name', extra.name);
      form.append('price', extra.price);
      if (extra.image == null) form.append('image', null);
      if (extra.image instanceof Blob) form.append('image', extra.image);
      for (const [i, extraIngredient] of extra.extraIngredients.entries()) {
        if (extraIngredient.id) form.append(`extraIngredients[${i}][id]`, extraIngredient.id);
        form.append(`extraIngredients[${i}][ingredientId]`, extraIngredient.ingredientId);
        form.append(`extraIngredients[${i}][qty]`, extraIngredient.qty);
      }
      const res = await $axios.put(`extra/${extra.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      commit('updateExtra', res.data);
    },
    async destroy({ commit }, that) {
      const { extra, $axios } = that;
      await $axios.delete(`extra/${extra.id}`);
      commit('deleteExtra', extra);
    },
  },
};
