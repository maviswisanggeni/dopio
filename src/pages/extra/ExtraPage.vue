<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Ekstra</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getExtras()"></q-btn>
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
      <div class="q-pa-sm" v-for="extra in extrasFiltered" :key="extra.id">
        <q-card class="extra-card cursor-pointer shadow-1" @click="openEditDialog(extra)">
          <div class="row">
            <div style="width: 70px;">
              <q-img :ratio="1" class="rounded-borders" spinner-size="0px" style="width:60px;" v-if="extra.image" :src="extra.image" />
              <q-avatar v-else rounded color="primary" text-color="white" size="60px">{{ extra.name | avatar }}</q-avatar>
            </div>
            <div class="column">
              <div class="extra-title">{{ extra.name }}</div>
              <q-space />
              <div v-if="extra.price != 0" class="extra-price">Rp {{ extra.price | numeric }}</div>
              <div v-else class="free-label">GRATIS</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-extra-dialog v-model="isCreateDialogOpen" />
    <edit-extra-dialog v-model="isEditDialogOpen" :extraSelected="extraSelected" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import CreateExtraDialog from './CreateExtraDialog';
import EditExtraDialog from './EditExtraDialog';

export default {
  name: 'ExtraPage',
  components: { CreateExtraDialog, EditExtraDialog },
  data() {
    return {
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      extraSelected: {},
      filter: '',
    };
  },
  computed: {
    ...mapState('extra', {
      extras: state => state.extras,
      isLoading: state => state.isLoading,
    }),
    extrasFiltered() {
      const filter = this.filter.toLowerCase();
      if (!filter) return this.extras;
      return this.extras.filter(extra => extra.name.toLowerCase().includes(filter));
    },
  },
  mounted() {
    this.getExtras();
  },
  methods: {
    async getExtras() {
      await this.$store.dispatch('extra/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(extra) {
      this.extra = extra;
      this.extraSelected = await this.$store.dispatch('extra/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.extra-card {
  padding: 10px;
  width: 220px;
}
.extra-title {
  font-family: Proxima-Nova-Alt;
  font-size: 13px;
  font-weight: 800;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
}
.extra-price {
  font-family: Proxima-Nova-Alt;
  font-size: 12px;
  font-weight: 800;
}
.free-label {
  color: $blue;
  font-size: 12px;
  font-weight: 800;
}
</style>
