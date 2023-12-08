import Vue from 'vue';
import _ from 'lodash';

export default {
  namespaced: true,
  data() {
    return {
      dataProduk: {}
    };
  },
  state: {
    produks: [],
    variants: [],
    allVariants: [],
    variantStocks: [],
    variantRecipes: [],
    produkVariants: [],
    emptyProduks: [],
    produkKategoris: [],
    produkExtras: []
  },
  getters: {
    optionProduk(state) {
      return state.produks.map(produk => ({ ...produk, label: produk.name, value: produk.id }));
    },
    optionVariant(state) {
      return state.variants.map(variant => ({ ...variant, label: variant.fullName, value: variant.id }));
    },
    optionAllVariant(state) {
      return state.allVariants.map(variant => ({ ...variant, label: variant.fullName, value: variant.id }));
    },
    listVariantStocks(state) {
      const v = state.variantStocks;
      return v;
    }
  },
  mutations: {
    setProduks: (state, produks) => (state.produks = produks),
    setVariant: (state, variants) => (state.variants = variants),
    setAllVariant: (state, allVariants) => (state.allVariants = allVariants),
    setVariantStock: (state, variantStocks) => (state.variantStocks = variantStocks),
    setVariantRecipe: (state, variantRecipes) => (state.variantRecipes = variantRecipes),
    setProduksVariant: (state, produkVariants) => (state.produkVariants = produkVariants),
    setEmptyProduk: (state, emptyProduks) => (state.emptyProduks = emptyProduks),
    setProdukKategori: (state, produkKategoris) => (state.produkKategoris = produkKategoris),
    setProdukExtra: (state, produkExtras) => (state.produkExtras = produkExtras),
    addProduk: (state, produk) => state.produks.unshift(produk),
    updateProduk: (state, payload) => {
      const index = state.produks.findIndex(produk => produk.id == payload.id);
      Vue.set(state.produks, index, payload);
    },
    hapusProduk: (state, payload) => {
      const index = state.produks.findIndex(produk => produk.id == payload.id);
      state.produks.splice(index, 1);
    }
  },
  async created() {
    const res = await $axios.get('product');
    this.dataProduk = res.data;
  },
  actions: {
    async get({ commit }, that) {
      const { $axios } = that;
      const res = await $axios.get('product');
      this.dataProduk = res.data;
      commit('setProduks', res.data);
    },
    async getProductVariant({ commit }, that) {
      let variantData = [];
      for (const [i, v] of this.dataProduk.entries()) {
        if (v.hasStock) {
          variantData.push(v);
        }
      }
      commit('setProduksVariant', variantData);
    },
    async getAllVariant({ commit }, that) {
      let variantData = [];
      for (const [i, v] of this.dataProduk.entries()) {
        for (const value of v.variants) {
          variantData.push(value);
        }
      }
      commit('setAllVariant', variantData);
    },
    async getVariant({ commit }, that) {
      let variantData = [];
      for (const [i, v] of this.dataProduk.entries()) {
        if (v.hasStock) {
          for (const value of v.variants) {
            variantData.push(value);
          }
        }
      }
      commit('setVariant', variantData);
    },
    async getVariantStock({ commit }, that) {
      let variantData = [];
      for (const [i, v] of this.dataProduk.entries()) {
        if (v.hasStock) {
          for (const value of v.variants) {
            variantData.push(value);
          }
        }
      }
      commit('setVariantStock', variantData);
    },
    async getVariantRecipe({ commit }, that) {
      let variantData = [];
      for (const [i, v] of this.dataProduk.entries()) {
        if (v.hasRecipe) {
          for (const value of v.variants) {
            variantData.push(value);
          }
        }
      }
      commit('setVariantRecipe', variantData);
    },
    async getEmptyProduk({ commit }, that) {
      let variantData = [];
      for (const [i, v] of this.dataProduk.entries()) {
        if (v.hasStock) {
          const variants = _.filter(v.variants, function(o) {
            return o.stock <= o.alertIn;
          });
          variantData = _.sortBy(variants, ['stock']);
        }
      }
      commit('setEmptyProduk', variantData);
    },

    async getProdukKategori({ commit }, that) {
      let variantData = [];
      for (const [i, v] of this.dataProduk.entries()) {
        if (v.categoryId && v.categoryId == that) {
          variantData.push(v);
        }
      }
      commit('setProdukKategori', variantData);
    },

    async getProdukExtra({ commit }, that) {
      let variantData = [];
      for (const [i, v] of this.dataProduk.entries()) {
        if (v.hasRecipe && v.extras.length > 0) {
          for (const value of v.extras) {
            if (value.id == that) {
              variantData.push(v);
            }
          }
        }
      }
      commit('setProdukExtra', variantData);
    }
  }
};
