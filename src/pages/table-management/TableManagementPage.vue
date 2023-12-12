<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Manajemen Meja</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getDineTable()"></q-btn>
    </portal>

    <div class="row q-pt-md q-col-gutter-md">
      <div v-for="dineTable in dineTables" :key="dineTable.id">
        <q-card class="dine-table-card cursor-pointer" @click="openEditDialog(dineTable)">
          <div class="dine-table-label absolute-center">{{ dineTable.label }}</div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-table-dialog v-model="isCreateDialogOpen" />
    <edit-table-dialog v-model="isEditDialogOpen" :dineTableSelected="dineTable" />
  </q-page>
</template>

<script>
import CreateTableDialog from './CreateTableDialog';
import EditTableDialog from './EditTableDialog';
import { mapState } from 'vuex';

export default {
  name: 'TableManagementPage',
  components: { CreateTableDialog, EditTableDialog },
  data() {
    return {
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      dineTable: {},
    };
  },
  computed: {
    ...mapState('dineTable', {
      dineTables: state => state.dineTables,
      isLoading: state => state.isLoading,
    }),
  },
  mounted() {
    this.getDineTable();
  },
  methods: {
    async getDineTable() {
      await this.$store.dispatch('dineTable/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(dineTable) {
      this.dineTable = dineTable;
      this.dineTable = await this.$store.dispatch('dineTable/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.dine-table-card {
  width: 80px;
  height: 80px;
  border-radius: 8px;
}

.dine-table-label {
  color: $grey-9;
  font-weight: 700;
  font-size: 20px;
}
</style>
