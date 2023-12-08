import { date } from 'quasar';
import { excludeEmpty, convertUTC } from 'src/helpers/object.helper';
import { add, findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    purchases: [],
    params: {},
    isLoading: false,
  },
  getters: {
    purchasesByDate(state) {
      const grouPurchases = state.purchases.reduce((purchases, purchase) => {
        const date = purchase.createdAt.split('T')[0];
        if (!purchases[date]) purchases[date] = [];
        purchases[date].push(purchase);
        return purchases;
      }, {});

      return Object.keys(grouPurchases).map(date => {
        return {
          createdAt: date,
          totalPurchaseQty: grouPurchases[date].reduce((sum, purchase) => sum + purchase.totalPurchaseQty, 0),
          purchases: grouPurchases[date],
        };
      });
    },
  },
  mutations: {
    setPurchases: (state, purchases) => {
      for (const purchase of purchases) setPurchaseItems(purchase);
      state.purchases = purchases;
    },
    addPurchase: (state, purchase) => {
      setPurchaseItems(purchase);
      add(state.purchases, purchase);
    },
    updatePurchase: (state, purchase) => {
      setPurchaseItems(purchase);
      findAndUpdate(state.purchases, purchase);
    },
    deletePurchase: (state, purchase) => findAndDelete(state.purchases, purchase),
    setParam: (state, params) => (state.params = params),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      const { pagination, filter, $axios } = that;
      const { page, rowsPerPage } = pagination;
      const paginate = { limit: rowsPerPage, page };
      const params = { ...paginate, ...excludeEmpty(filter) };

      if (params.startDate && params.endDate) {
        params.startDate = convertUTC(params.startDate);
        params.endDate = convertUTC(date.addToDate(new Date(params.endDate), { days: 1 }));
      }

      try {
        const res = await $axios.get('purchase', { params });
        commit('setParam', params);
        commit('setPurchases', res.data.items);
        return res.data;
      } finally {
        commit('setLoading', false);
      }
    },
    async refresh({ commit, state }, that) {
      const { $axios } = that;
      const { params } = state;
      commit('setLoading', true);
      try {
        const res = await $axios.get('purchase', { params });
        commit('setPurchases', res.data.items);
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { purchase, $axios } = that;
        const res = await $axios.get(`purchase/${purchase.id}`);
        const purchaseUpdated = res.data;
        for (const pd of purchaseUpdated.purchaseDetails) {
          if (pd.itemType == 'INGREDIENT') {
            pd.name = pd.ingredient.name;
            pd.inventoryId = 'I' + pd.ingredientId;
            continue;
          }
          pd.name = pd.productVariant.fullName;
          pd.inventoryId = 'P' + pd.productVariantId;
        }
        return purchaseUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { purchase, $axios } = that;
      const res = await $axios.post('purchase', purchase);
      commit('addPurchase', res.data);
    },
    async update({ commit }, that) {
      const { purchase, $axios } = that;
      const res = await $axios.put(`purchase/${purchase.id}`, purchase);
      commit('updatePurchase', res.data);
    },
    async destroy({ commit }, that) {
      const { purchase, $axios } = that;
      await $axios.delete(`purchase/${purchase.id}`);
      commit('deletePurchase', purchase);
    },
  },
};

function setPurchaseItems(purchase) {
  purchase.items = purchase.purchaseDetails.map(purchase => purchase.name).join(', ');
}
