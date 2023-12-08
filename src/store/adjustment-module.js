import { date } from 'quasar';
import { excludeEmpty, convertUTC } from 'src/helpers/object.helper';

export default {
  namespaced: true,
  state: {
    adjustments: [],
    params: {},
    isLoading: false,
  },
  getters: {
    adjustmentsByDate(state) {
      const groupAdjustments = state.adjustments.reduce((adjustments, adjustment) => {
        const date = adjustment.createdAt.split('T')[0];
        if (!adjustments[date]) adjustments[date] = [];
        adjustments[date].push(adjustment);
        return adjustments;
      }, {});

      return Object.keys(groupAdjustments).map(date => {
        return {
          createdAt: date,
          totalAdjustmentQty: groupAdjustments[date].reduce((sum, adjustment) => sum + adjustment.totalAdjustmentQty, 0),
          adjustments: groupAdjustments[date],
        };
      });
    },
  },
  mutations: {
    setAdjustments: (state, adjustments) => {
      for (const adjustment of adjustments) {
        adjustment.totalAdjustmentQty = adjustment.adjustmentDetails.reduce((a, b) => a + b.adjustmentQty, 0);
        adjustment.items = adjustment.adjustmentDetails.map(adjDetail => adjDetail.name).join(', ');
      }
      state.adjustments = adjustments;
    },
    setParam: (state, params) => (state.params = params),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
    updateAdjustment: (state, adjustment) => {
      const index = state.adjustments.findIndex(adjustment => adjustment.id == adjustment.id);
      Vue.set(state.adjustments, index, adjustment);
    },
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { pagination, filter, $axios } = that;
        const { page, rowsPerPage } = pagination;
        const paginate = { limit: rowsPerPage, page };
        const params = { ...paginate, ...excludeEmpty(filter) };

        if (params.startDate && params.endDate) {
          params.startDate = convertUTC(params.startDate);
          params.endDate = convertUTC(date.addToDate(new Date(params.endDate), { days: 1 }));
        }

        const res = await $axios.get('adjustment', { params });
        commit('setParam', params);
        commit('setAdjustments', res.data.items);
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
        const res = await $axios.get('adjustment', { params });
        commit('setAdjustments', res.data.items);
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { adjustment, $axios } = that;
        const res = await $axios.get(`adjustment/${adjustment.id}`);
        const adjustmentUpdated = res.data;
        adjustmentUpdated.totalAdjustmentQty = adjustment.adjustmentDetails.reduce((a, b) => a + b.adjustmentQty, 0);
        return adjustmentUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { adjustment, $axios } = that;
      await $axios.post('adjustment', adjustment);
    },
  },
};
