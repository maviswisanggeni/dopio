<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Pemasok</span>
      <q-btn round dense size="12px" flat icon="refresh" @click="getSupplier()"></q-btn>
    </portal>

    <div class="row q-gutter-y-sm justify-center items-center q-mb-md">
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input class="app-input" outlined dense debounce="150" color="blue" bg-color="white" v-model="filter">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-gutter-xs">
      <div v-for="supplier in suppliersFiltered" :key="supplier.id" class="q-pa-sm">
        <q-card class="supplier-card cursor-pointer" @click="openEditDialog(supplier)">
          <div class="supplier-label">{{ supplier.name }}</div>
          <div class="email-label">{{ supplier.email }}</div>
          <div style="height: 16px;"></div>
          <div class="phone-label">{{ supplier.phone | phoneNumber }}</div>
          <div class="address-label">{{ supplier.city ? supplier.city + ',' : '' }} {{ supplier.address }}</div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-supplier-dialog v-model="isCreateDialogOpen" />
    <edit-supplier-dialog v-model="isEditDialogOpen" :supplierSelected="supplier" />
  </q-page>
</template>

<script>
import CreateSupplierDialog from './CreateSupplierDialog';
import EditSupplierDialog from './EditSupplierDialog';
import { mapState } from 'vuex';

export default {
  name: 'SupplierPage',
  components: { CreateSupplierDialog, EditSupplierDialog },
  data() {
    return {
      filter: null,
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      pagination: { page: 1, rowsPerPage: 25, rowsNumber: 25 },
      supplier: {},
    };
  },
  computed: {
    ...mapState('supplier', {
      suppliers: state => state.suppliers,
      isLoading: state => state.isLoading,
    }),
    suppliersFiltered() {
      if (!this.filter) return this.suppliers;
      const filter = this.filter.toLowerCase();
      const keys = ['name', 'email', 'phone', 'address', 'city'];
      return this.suppliers.filter(supplier => {
        for (const key of keys) {
          const res = supplier[key].toLowerCase().includes(filter);
          if (res) return true;
        }
      });
    },
  },
  mounted() {
    this.getSupplier();
  },
  methods: {
    async getSupplier() {
      await this.$store.dispatch('supplier/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(supplier) {
      this.supplier = supplier;
      this.supplier = await this.$store.dispatch('supplier/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.supplier-card {
  width: 250px;
  padding: 12px;
  border-radius: 8px;
}

.supplier-label {
  font-size: 20px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.25px;
  margin-bottom: -4px;
}

.role-label {
  color: #0064fa !important;
  font-family: Proxima-Nova-Alt;
  font-size: 14px;
  font-weight: 600;
}

.email-label {
  font-size: 12px;
  font-weight: bold;
  font-style: italic;
  height: 10px;
  color: $primary;
  margin-top: -4px;
  margin-bottom: 8px;
}

.phone-label {
  font-size: 12px;
  height: 10px;
  font-weight: bold;
  margin-bottom: 8px;
}

.address-label {
  font-size: 11px;
  color: $grey-8;
  height: 10px;
  margin-bottom: 4px;
}
</style>
