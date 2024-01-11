<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Bahan</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getIngredients()"></q-btn>
    </portal>

    <div class="row q-gutter-y-sm justify-center items-end q-mb-md">
      <div class="col-xs-12 col-sm-4 col-md-2">
        <base-select-input v-model="filter.status" :options="statuses" name="Status" />
      </div>
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input class="app-input" outlined dense debounce="150" color="blue" bg-color="white" v-model="filter.name">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      :data="ingredients"
      :columns="columns"
      :filter="filter"
      :filter-method="filterIngredients"
      :rows-per-page-options="[25, 50, 100]"
      :loading="isLoading"
      class="app-sticky-table"
      style="max-height: calc(100vh - 140px)"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" style="top: 50px;" size="28px" />
      </template>
      <template v-slot:body="props">
        <q-tr @click="openEditDialog(props.row)" style="cursor:pointer" :props="props">
          <q-td key="name" :props="props">{{ props.row.name }} </q-td>
          <q-td key="stock" :props="props">{{ props.row.stock | numeric }} </q-td>
          <q-td key="unit" :props="props">{{ props.row.unit ? props.row.unit.name : null }} </q-td>
          <q-td key="isAlert" :props="props">
            <q-icon v-if="props.row.isAlert" size="16px" color="positive" name="check"></q-icon>
          </q-td>
          <q-td key="status" :props="props">
            <q-chip v-if="getStatus(props.row) == 'AVAILABLE'" class="text-white status-badge" color="positive">Stok Tersedia</q-chip>
            <q-chip v-if="getStatus(props.row) == 'ALMOST_OUT'" class="text-white status-badge" color="orange">Stok Hampir Habis</q-chip>
            <q-chip v-if="getStatus(props.row) == 'EMPTY'" class="text-white status-badge" color="red">Stok Kosong</q-chip>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-ingredient-dialog v-model="isCreateDialogOpen" />
    <edit-ingredient-dialog v-model="isEditDialogOpen" :ingredientSelected="ingredient" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import CreateIngredientDialog from './CreateIngredientDialog';
import EditIngredientDialog from './EditIngredientDialog';

export default {
  name: 'IngredientPage',
  components: { CreateIngredientDialog, EditIngredientDialog },
  data() {
    return {
      filter: { name: '', status: null },
      pagination: { page: 1, rowsPerPage: 25, rowsNumber: 25 },
      columns: [
        { name: 'name', label: 'Nama', field: 'name', align: 'left', sortable: true },
        { name: 'stock', label: 'Stok', field: 'stock', align: 'right', sortable: true, headerStyle: 'width: 5%;' },
        { name: 'unit', label: 'Satuan', field: 'unit.name', align: 'left', sortable: true, headerStyle: 'width: 5%;' },
        { name: 'isAlert', label: 'Notifikasi', field: 'isAlert', align: 'center', sortable: true, headerStyle: 'width: 5%;' },
        { name: 'status', label: 'Status', align: 'center', headerStyle: 'width: 10%;' },
      ],
      statuses: [
        { value: null, label: 'Semua' },
        { value: 'AVAILABLE', label: 'Stok Tersedia' },
        { value: 'ALMOST_OUT', label: 'Stok Hampir Habis' },
        { value: 'EMPTY', label: 'Stok Kosong' },
      ],
      ingredient: {},
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      ingredients: [],
    };
  },
  computed: {
    ...mapState('ingredient', {
      // ingredients: state => state.ingredients,
      isLoading: state => state.isLoading,
    }),
  },
  mounted() {
    this.getIngredients();
  },
  methods: {
    getStatus(ingredient) {
      if (ingredient.stock <= 0) return 'EMPTY';
      if (ingredient.alertIn === null) return 'AVAILABLE';
      if (ingredient.stock <= ingredient.alertIn) return 'ALMOST_OUT';
      return 'AVAILABLE';
    },
    async getIngredients() {
      await this.$store.dispatch('ingredient/get', this);
      this.ingredients = this.$store.state.ingredient.ingredients;
    },
    filterIngredients(rows) {
      return rows.filter(item => {
        let isFilterName = true;
        let isFilterStatus = true;
        if (this.filter.name != '') isFilterName = item.name.toLowerCase().includes(this.filter.name.toLowerCase());
        if (this.filter.status) isFilterStatus = item.status == this.filter.status;
        return isFilterName && isFilterStatus;
      });
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(ingredient) {
      this.ingredient = ingredient;
      this.ingredient = await this.$store.dispatch('ingredient/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.status-badge {
  font-size: 10.5px;
  padding: 8px 8px;
}
</style>
