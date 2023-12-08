import { add, findAndUpdate, findAndDelete } from 'src/helpers/array.helper';

export default {
  namespaced: true,
  state: {
    packets: [],
    isLoading: false,
  },
  getters: {},
  mutations: {
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
    setPackets: (state, packets) => (state.packets = packets),
    addPacket: (state, packet) => add(state.packets, packet),
    updatePacket: (state, packet) => findAndUpdate(state.packets, packet),
    deletePacket: (state, packet) => findAndDelete(state.packets, packet),
  },
  actions: {
    async get({ commit }, that) {
      commit('setLoading', true);
      try {
        const { $axios } = that;
        const res = await $axios.get('packet');
        commit('setPackets', res.data);
        return res.data;
      } finally {
        commit('setLoading', false);
      }
    },
    async show({ commit }, that) {
      commit('setLoading', true);
      try {
        const { packet, $axios } = that;
        const res = await $axios.get(`packet/${packet.id}`);
        const packetUpdated = res.data;
        commit('updatePacket', packetUpdated);
        return packetUpdated;
      } finally {
        commit('setLoading', false);
      }
    },
    async create({ commit }, that) {
      const { packet, $axios } = that;
      const form = new FormData();
      form.append('name', packet.name);
      form.append('price', packet.price);
      form.append('description', packet.description);
      if (packet.image instanceof Blob) form.append('image', packet.image);
      for (const [i, ei] of packet.packetDetails.entries()) {
        form.append(`packetDetails[${i}][productVariantId]`, ei.productVariantId);
        form.append(`packetDetails[${i}][qty]`, ei.qty);
      }
      const res = await $axios.post(`packet`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      commit('addPacket', res.data);
    },
    async update({ commit }, that) {
      const { packet, $axios } = that;
      const form = new FormData();
      form.append('name', packet.name);
      form.append('price', packet.price);
      form.append('description', packet.description);
      if (packet.image instanceof Blob) form.append('image', packet.image);
      if (packet.image == null) form.append('image', packet.image);
      for (const [i, packetDetail] of packet.packetDetails.entries()) {
        if (packetDetail.id) form.append(`packetDetails[${i}][id]`, packetDetail.id);
        form.append(`packetDetails[${i}][productVariantId]`, packetDetail.productVariantId);
        form.append(`packetDetails[${i}][qty]`, packetDetail.qty);
      }
      const res = await $axios.put(`packet/${packet.id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      commit('updatePacket', res.data);
    },
    async destroy({ commit }, that) {
      const { packet, $axios } = that;
      await $axios.delete(`packet/${packet.id}`);
      commit('deletePacket', packet);
    },
  },
};
