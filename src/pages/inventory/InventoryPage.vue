<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs" @click="toggleFilterBar">Persediaan</span>
    </portal>

    <!-- Filter bar -->
    <q-form @submit="applyFilters" class="q-gutter-md" v-show="isFilterOpen">
      <div class="row justify-center items-end">
        <div class="col-xs-12 col-sm-4 col-md-2">
          <base-select-input
            v-model="filter.status"
            :options="statuses"
            name="Status"
            @input="applyFilters"
          />
        </div>
        <q-space></q-space>
        <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
          <q-input
            class="app-input"
            outlined
            dense
            debounce="150"
            color="blue"
            bg-color="white"
            v-model="filter.name"
            @input="applyFilters"
          >
            <template v-slot:prepend>
              <q-icon size="20px" name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-2">
          <q-btn label="Apply Filters" color="primary" type="submit" />
        </div>
      </div>
    </q-form>

    <q-table
      :data="inventories"
      :columns="columns"
      :filter="filter"
      :filter-method="filterInventories"
      :rows-per-page-options="[25, 50, 100]"
      class="app-sticky-table"
      style="max-height: calc(100vh - 140px)"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" style="top: 50px;" size="28px" />
      </template>
      <template v-slot:body="props">
        <q-tr>
          <q-td key="label">{{ props.row.label }} </q-td>
          <q-td key="stock" class="text-right">{{ props.row.stock | numeric }} </q-td>
          <q-td key="unit">{{ props.row.unit ? props.row.unit.name : 'unit' }} </q-td>
          <q-td key="isAlert" class="text-center">
            <q-icon v-if="props.row.isAlert" size="16px" color="positive" name="check"></q-icon>
          </q-td>
          <q-td key="status" class="text-center">
            <q-chip v-if="getStatus(props.row) == 'AVAILABLE'" class="text-white status-badge" color="positive">Stok Tersedia</q-chip>
            <q-chip v-if="getStatus(props.row) == 'ALMOST_OUT'" class="text-white status-badge" color="orange">Stok Hampir Habis</q-chip>
            <q-chip v-if="getStatus(props.row) == 'EMPTY'" class="text-white status-badge" color="red">Stok Kosong</q-chip>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
export default {
  name: 'IngredientPage',
  data() {
    return {
      filter: { name: '', status: null },
      isFilterOpen: false, // New property to track filter bar visibility
      pagination: { page: 1, rowsPerPage: 25, rowsNumber: 25 },
      columns: [
        { name: 'label', label: 'Nama', field: 'label', align: 'left', sortable: true },
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
    };
  },
  computed: {
    inventories() {
      const productVariants = this.$store.state.product.productVariants
        .filter(productVariant => productVariant.stock != null)
        .map(productVariant => {
          return { label: productVariant.fullName, type: 'PRODUCT', ...productVariant };
        });

      const ingredients = this.$store.state.ingredient.ingredients
        .filter(ingredient => ingredient.stock != null)
        .map(ingredient => {
          return { label: ingredient.name, type: 'INGREDIENT', ...ingredient };
        });

      return [...ingredients, ...productVariants];
    },
  },
  mounted() {},
  methods: {
    getStatus(ingredient) {
      if (ingredient.stock <= 0) return 'EMPTY';
      if (ingredient.alertIn === null) return 'AVAILABLE';
      if (ingredient.stock <= ingredient.alertIn) return 'ALMOST_OUT';
      return 'AVAILABLE';
    },
    filterInventories(rows) {
      return rows.filter(item => {
        let isFilterName = true;
        let isFilterStatus = true;
        if (this.filter.name != '') isFilterName = item.label.toLowerCase().includes(this.filter.name.toLowerCase());
        if (this.filter.status) isFilterStatus = item.status == this.filter.status;
        return isFilterName && isFilterStatus;
      });
    },
    toggleFilterBar() {
      this.isFilterOpen = !this.isFilterOpen;
    },
    applyFilters() {
      const filteredRows = this.filterInventories(this.inventories);
      // Do something with filteredRows if needed

      // Close the filter bar after applying filters
      this.isFilterOpen = false;
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
