import { add, findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    promos: [],
    isLoading: false,
  },
  mutations: {
    setPromos: (state, promos) => (state.promos = promos),
    addPromo: (state, promo) => add(state.promos, promo),
    updatePromo: (state, promo) => findAndUpdate(state.promos, promo),
    deletePromo: (state, promo) => findAndDelete(state.promos, promo),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('promo');
        commit('setPromos', res.data);
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { promo, $axios } = that;
        const res = await $axios.get(`promo/${promo.id}`);
        const promoUpdated = res.data;
        commit('updatePromo', promoUpdated);
        return promoUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { promo, $axios } = that;
      const discountValue = promo.type == 'DISCOUNT_PERCENT' ? promo.discountPercent : promo.discountValue;
      const payload = { name: promo.name, type: promo.type, discountValue, productVariantIds: promo.productVariantIds };
      const res = await $axios.post('promo', payload);
      commit('addPromo', res.data);
    },
    async update({ commit }, that) {
      const { promo, $axios } = that;
      const discountValue = promo.type == 'DISCOUNT_PERCENT' ? promo.discountPercent : promo.discountValue;
      const payload = { name: promo.name, type: promo.type, discountValue, productVariantIds: promo.productVariantIds };
      const res = await $axios.put(`promo/${promo.id}`, payload);
      commit('updatePromo', res.data);
    },
    async destroy({ commit }, that) {
      const { promo, $axios } = that;
      await $axios.delete(`promo/${promo.id}`);
      commit('deletePromo', promo);
    },
  },
};
