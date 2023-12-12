import { LocalStorage } from 'quasar';

export default {
  namespaced: true,
  state: {
    variants : [],
  },
  getters: {
    option(state) {
      return state.kategoris.map(kategori => ({ ...kategori, label: kategori.name, value: kategori.id }));
    }
  },
  mutations: {
    setKategoris: (state, kategoris) => (state.kategoris = kategoris),
    // addBank: (state, bank) => add(state.banks, bank),
    // addBank: (state, bank) => {
    //   state.banks.unshift(bank);
    //   return [...state.banks];
    // },
    // updateBank: (state, bank) => findAndUpdate(state.banks, bank),
    // deleteBank: (state, bank) => findAndDelete(state.banks, bank),
    // setScroll: (state, value) => (state.scroll = value)
  },
  actions: {
      async get({ commit }, that) {
      const { $axios } = that;
      const res = await $axios.get("category");
      commit("setKategoris", res.data);
    },
  },
};
