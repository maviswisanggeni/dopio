import Vue from 'vue';
import { add, findAndUpdate, findAndDelete } from 'src/helpers/array.helper';
import { getRangePrice } from 'src/helpers/app.helper';

export default {
  namespaced: true,
  state: {
    products: [],
    productVariants: [],
    isLoading: false,
  },
  getters: {},
  mutations: {
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
    setProducts: (state, products) => {
      state.productVariants = [];
      for (const product of products) {
        product.rangePrice = getRangePrice(product);
        for (const productVariant of product.variants) {
          productVariant.image = productVariant.image ?? product.image;
          productVariant.categoryName = product.category ? product.category.name : 'Lainnya';
          state.productVariants.push(productVariant);
        }
      }
      state.products = products;
    },
    addProduct: (state, product) => {
      product.variants[0].image = product.variants.image ?? product.image;
      product.variants[0].categoryName = product.category ? product.category.name : 'Lainnya';
      state.productVariants.unshift(product.variants[0]);
      product.rangePrice = getRangePrice(product);
      add(state.products, product);
    },
    updateProduct: (state, product) => {
      findAndUpdate(state.products, product);
      product.rangePrice = getRangePrice(product);
      for (const productVariant of product.variants) {
        productVariant.image = productVariant.image ?? product.image;
        productVariant.categoryName = product.category ? product.category.name : 'Lainnya';
        findAndUpdate(state.productVariants, productVariant);
      }
    },
    deleteProduct: (state, product) => {
      findAndDelete(state.products, product);
      for (const productVariant of product.variants) {
        findAndDelete(state.productVariants, productVariant);
      }
    },
    updateStockVariants: (state, variants) => {
      for (const variant of variants) {
        const index = state.productVariants.findIndex(item => item.id == variant.id);
        if (index < 0) return;
        const productVariant = state.productVariants[index];
        productVariant.stock = variant.stock;
        Vue.set(state.productVariants, index, productVariant);
      }
    },
  },
  actions: {
    async get({ commit }, that) {
      const { $axios } = that;
      const res = await $axios.get('product');
      commit('setProducts', res.data);
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { product, $axios } = that;
        const res = await $axios.get(`product/${product.id}`);
        const productUpdated = res.data;
        productUpdated.rangePrice = getRangePrice(productUpdated);
        commit('updateProduct', productUpdated);
        return productUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { product, $axios } = that;
      const form = createFormDataProduct(product);
      if (product.image == undefined) form.delete('image');
      const res = await $axios.post(`product`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const productCreated = res.data;
      commit('addProduct', productCreated);
    },
    async update({ commit }, that) {
      const { product, $axios } = that;
      const form = createFormDataProduct(product);
      const res = await $axios.put(`product/${product.id}`, form);
      const productUpdated = res.data;
      productUpdated.rangePrice = getRangePrice(productUpdated);
      commit('updateProduct', productUpdated);
    },
    async destroy({ commit }, that) {
      const { product, $axios } = that;
      await $axios.delete(`product/${product.id}`);
      commit('deleteProduct', product);
    },
  },
};

function createFormDataProduct(product) {
  const form = new FormData();
  form.append('name', product.name);
  if (product.categoryId) form.append('categoryId', product.categoryId);
  if (product.description) form.append('description', product.description);
  if (product.image instanceof Object) form.append('image', product.image);
  if (product.image == null) form.append('image', null);

  for (const extraId of product.extraIds) form.append('extraIds[]', extraId);

  for (const [i, variant] of product.variants.entries()) {
    const key = `variants[${i}]`;
    if (variant.id) form.append(`${key}[id]`, variant.id);
    if (variant.name != null) form.append(`${key}[name]`, variant.name);
    form.append(`${key}[price]`, variant.price);
    if (variant.image instanceof Blob) form.append(`${key}[qty]`, variant.image);
    if (product.hasStock) {
      form.append(`${key}[stock]`, variant.stock);
      form.append(`${key}[alertIn]`, variant.alertIn);
      form.append(`${key}[isAlert]`, variant.isAlert);
      continue;
    }

    if (product.hasRecipe) {
      for (const [j, recipeDetail] of variant.recipeDetails.entries()) {
        const key = `variants[${i}][recipeDetails][${j}]`;
        if (recipeDetail.id) form.append(`${key}[id]`, recipeDetail.id);
        form.append(`${key}[ingredientId]`, recipeDetail.ingredientId);
        form.append(`${key}[qty]`, recipeDetail.qty);
      }
    }
  }

  return form;
}
