<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Satuan</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getUnits()"></q-btn>
    </portal>

    <div class="row items-center q-mb-md ">
      <q-space />
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input class="app-input" outlined dense debounce="150" color="blue" bg-color="white" v-model="filter">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-scroll-area horizontal style="height: calc(100vh - 140px); margin-left: -8px;">
      <div class="column inline wrap" style="max-height: calc(100vh - 140px);">
        <q-card flat class="unit-column" v-for="(groupedUnit, index) in groupUnits" :key="index">
          <div class="unit-title">{{ index }}</div>
          <template v-for="(unit, index) in groupedUnit">
            <div :key="index" class="unit-caption" @click="openEditDialog(unit)">
              <span>{{ unit.name }}</span>
            </div>
          </template>
        </q-card>
      </div>
    </q-scroll-area>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-unit-dialog v-model="isCreateDialogOpen" />
    <edit-unit-dialog v-model="isEditDialogOpen" :unitSelected="unit" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import CreateUnitDialog from './CreateUnitDialog';
import EditUnitDialog from './EditUnitDialog';

export default {
  name: 'UnitPage',
  components: { CreateUnitDialog, EditUnitDialog },
  data() {
    return {
      columns: [{ name: 'name', label: 'Nama Satuan', field: 'name', align: 'left' }],
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      unit: {},
      filter: '',
    };
  },
  computed: {
    ...mapState('unit', {
      units: state => state.units,
      isLoading: state => state.isLoading,
    }),
    groupUnits() {
      const filter = this.filter.toLowerCase();
      const unitsFiltered = this.units.filter(unit => unit.name.toLowerCase().includes(filter));
      return unitsFiltered.reduce((collection, unit) => {
        let group = unit.name[0];
        if (!collection[group]) collection[group] = [];
        collection[group].push(unit);
        return collection;
      }, {});
    },
  },
  mounted() {
    this.getUnits();
  },
  methods: {
    async getUnits() {
      await this.$store.dispatch('unit/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(unit) {
      this.unit = unit;
      this.unit = await this.$store.dispatch('unit/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.unit-column {
  font-family: Proxima-Nova-Alt;
  width: 150px;
  margin: 4px;
  padding: 8px;
}

.unit-title {
  text-transform: uppercase;
  font-size: 26px;
  font-weight: 700;
}

.unit-caption {
  font-size: 14px;
  font-weight: 300;
  color: $grey-8;
  cursor: pointer;

  &:hover {
    color: $primary;
    font-weight: 700;
  }
}
</style>
