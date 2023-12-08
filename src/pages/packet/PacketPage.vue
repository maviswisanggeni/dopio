<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Paket</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getPackets()"></q-btn>
    </portal>

    <div class="row q-gutter-y-sm justify-center items-center q-mb-sm">
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input class="app-input" outlined dense debounce="150" color="blue" bg-color="white" v-model="filter">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row">
      <div class="q-pa-sm" v-for="packet in packetsFiltered" :key="packet.id">
        <q-card class="packet-card cursor-pointer shadow-1" @click="openEditDialog(packet)">
          <div class="row">
            <div style="width: 100px;">
              <q-img :ratio="1" class="rounded-borders" spinner-size="0px" style="width:90px;" v-if="packet.image" :src="packet.image" />
              <q-avatar v-else rounded color="primary" text-color="white" size="90px">{{ packet.name | avatar }}</q-avatar>
            </div>
            <div style="width: 200px;" class="column">
              <div class="packet-title">{{ packet.name }}</div>
              <div class="packet-description">{{ packet.description }}</div>
              <q-space />
              <div class="row packet-details">
                <q-chip
                  v-for="product in packet.packetDetails"
                  :key="product.id"
                  class="product-chip text-white"
                  color="blue-5"
                  text-color="white"
                  dense
                >
                  <span>{{ product.productVariant.fullName }}</span>
                </q-chip>
              </div>
              <div class="packet-price">Rp {{ packet.price | numeric }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-packet-dialog v-model="isCreateDialogOpen" />
    <edit-packet-dialog v-model="isEditDialogOpen" :packetSelected="packetSelected" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import CreatePacketDialog from './CreatePacketDialog';
import EditPacketDialog from './EditPacketDialog';

export default {
  name: 'PacketPage',
  components: { CreatePacketDialog, EditPacketDialog },
  data() {
    return {
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      packetSelected: {},
      filter: '',
    };
  },
  computed: {
    ...mapState('packet', {
      packets: state => state.packets,
      isLoading: state => state.isLoading,
    }),
    packetsFiltered() {
      const filter = this.filter.toLowerCase();
      if (!filter) return this.packets;
      return this.packets.filter(packet => {
        if (packet.name.toLowerCase().includes(filter)) return true;
        if (packet.description.toLowerCase().includes(filter)) return true;
        for (const packetDetail of packet.packetDetails) {
          const name = packetDetail.productVariant.fullName.toLowerCase();
          if (name.includes(filter)) return true;
        }
        return false;
      });
    },
  },
  mounted() {
    this.getPackets();
  },
  methods: {
    async getPackets() {
      await this.$store.dispatch('packet/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(packet) {
      this.packet = packet;
      this.packetSelected = await this.$store.dispatch('packet/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.packet-card {
  padding: 10px;
  width: 330px;
}

.packet-title {
  font-family: Proxima-Nova-Alt;
  font-size: 16px;
  font-weight: 800;
}

.packet-description {
  font-size: 11px;
  font-weight: 300;
  color: $grey-9 8;
  height: 28px;
  line-height: 12.5px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.packet-price {
  font-family: Proxima-Nova-Alt;
  font-size: 12px;
  font-weight: 800;
}

.packet-details {
  margin-left: -4px;
  width: 210px;
  height: 16px;
  overflow: hidden;
}

.product-chip {
  font-family: Proxima-Nova-Alt;
  text-overflow: ellipsis !important;
  max-width: 100px;
  padding: 0px 8px;
  margin: 0px 2px 10px 2px;
  font-size: 10px;
  font-weight: 300;
}
</style>
