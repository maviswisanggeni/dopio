import { findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    payments: [],
    isLoading: false,
  },
  getters: {
    paymentMethods(state) {
      const paymentMethods = [];
      for (const payment of state.payments) {
        const paymentMethod = paymentMethods.find(pm => pm.id == payment.methodId);
        if (!paymentMethod) paymentMethods.push(payment.method);
      }
      for (const paymentMethod of paymentMethods) {
        paymentMethod.payments = state.payments.filter(payment => payment.methodId == paymentMethod.id);
      }
      return paymentMethods.sort((a, b) => a.id - b.id);
    },
  },
  mutations: {
    setPayments: (state, payments) => (state.payments = payments),
    addPayment: (state, payment) => state.payments.push(payment),
    updatePayment: (state, payment) => findAndUpdate(state.payments, payment),
    deletePayment: (state, payment) => findAndDelete(state.payments, payment),
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('payment');
        commit('setPayments', res.data);
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { payment, $axios } = that;
        const res = await $axios.get(`payment/${payment.id}`);
        const paymentUpdated = res.data;
        commit('updatePayment', paymentUpdated);
        return paymentUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { payment, $axios } = that;
      const res = await $axios.post('payment', payment);
      commit('addPayment', res.data);
    },
    async update({ commit }, that) {
      const { payment, $axios } = that;
      const res = await $axios.put(`payment/${payment.id}`, payment);
      commit('updatePayment', res.data);
    },
    async toogleActive({ commit }, that) {
      const { payment, $axios, isActive } = that;
      commit('updatePayment', { ...payment, isActive });
      await $axios.put(`payment/${payment.id}`, { isActive });
    },
    async destroy({ commit }, that) {
      const { payment, $axios } = that;
      await $axios.delete(`payment/${payment.id}`);
      commit('deletePayment', payment);
    },
  },
};
