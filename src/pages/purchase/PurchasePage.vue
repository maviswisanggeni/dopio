<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Pembelian</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getPurchases()" />
      <q-btn round dense size="12px" flat icon="mdi-microsoft-excel" color="green" @click="downloadExcel()">
        <q-tooltip>Download Excel</q-tooltip>
      </q-btn>
    </portal>

    <div class="row q-gutter-sm justify-center items-end q-mb-sm">
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.startDate" name="Tanggal Mulai" />
      </div>
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.endDate" name="Tanggal Selesai" />
      </div>
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input outlined dense class="app-input" debounce="300" color="blue" bg-color="white" v-model="filter.search" @input="getPurchases()">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-scroll-area
      style="height: calc(100vh - 200px); width: 100%"
      :thumb-style="{ right: '-2px', borderRadius: '100px', backgroundColor: '#b7c0c9', width: '4px', opacity: 0.6 }"
    >
      <div v-for="(purchaseByDate, index) in purchasesByDate" :key="index">
        <table class="purchase-table">
          <tr>
            <th class="text-left table-date-header" style="min-width: 110px; width: 10%">{{ purchaseByDate.createdAt | isoDateToLocale }}</th>
            <th class="text-left table-header" style="width: 10%">No</th>
            <th class="text-left table-header" style="width: 10%">Supplier</th>
            <th class="text-left table-header" style="width: 40%">Items</th>
            <th class="text-left table-header" style="width: 22%">Catatan</th>
            <th class="text-right table-header" style="min-width: 100px; width: 8%">Grand Total</th>
          </tr>
          <tr class="table-row" v-for="purchase in purchaseByDate.purchases" :key="purchase.id" @click="openEditDialog(purchase)">
            <td class="table-cell primary">{{ purchase.createdAt | time }}</td>
            <td class="table-cell">{{ purchase.orderNo ? purchase.orderNo : '-' }}</td>
            <td class="table-cell">{{ purchase.supplier ? purchase.supplier.name : '-' }}</td>
            <td class="table-cell">{{ purchase.items }}</td>
            <td class="table-cell">{{ purchase.note }}</td>
            <td class="text-right table-cell">{{ purchase.grandTotal | numeric }}</td>
          </tr>
        </table>
      </div>
    </q-scroll-area>

    <q-page-sticky position="bottom" :offset="[0, 8]">
      <q-pagination
        size="12px"
        padding="4px"
        v-model="pagination.page"
        :max="pagination.totalPages"
        :direction-links="true"
        @input="getPurchases"
        input
      />
    </q-page-sticky>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-purchase-dialog v-model="isCreateDialogOpen" />
    <edit-purchase-dialog v-model="isEditDialogOpen" :purchaseSelected="purchase" />
  </q-page>
</template>

<script>
import CreatePurchaseDialog from './CreatePurchaseDialog';
import EditPurchaseDialog from './EditPurchaseDialog';
import { mapState, mapGetters } from 'vuex';
import fileDownload from 'js-file-download';

export default {
  name: 'PurchasePage',
  components: { CreatePurchaseDialog, EditPurchaseDialog },

  data() {
    return {
      filter: { search: '', startDate: null, endDate: null },
      pagination: { page: 1, rowsPerPage: 25, totalPages: 1 },
      purchase: null,
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
    };
  },

  computed: {
    ...mapState('purchase', {
      purchases: state => state.purchases,
      isLoading: state => state.isLoading,
    }),
    ...mapGetters('purchase', ['purchasesByDate']),
  },

  watch: {
    'filter.startDate'(value) {
      if (value && !this.filter.endDate) {
        this.filter.endDate = value;
        return;
      }
      this.getPurchases();
    },
    'filter.endDate'() {
      if (!this.filter.startDate && this.filter.endDate) return;
      this.getPurchases();
    },
  },

  mounted() {
    this.getPurchases();
  },

  methods: {
    async getPurchases() {
      const { meta } = await this.$store.dispatch('purchase/get', this);
      this.pagination.page = meta.currentPage;
      this.pagination.rowsPerPage = meta.itemsPerPage;
      this.pagination.totalPages = meta.totalPages;
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(purchase) {
      this.purchase = purchase;
      this.purchase = await this.$store.dispatch('purchase/show', this);
      this.isEditDialogOpen = true;
    },
    async downloadExcel() {
      if (!this.filter.startDate || !this.filter.endDate) {
        return this.$q.notify({ message: 'Tanggal mulai dan tanggal selesai harus diisi', color: 'red' });
      }
      const res = await this.$axios.get('/purchase/excel', { params: this.filter, responseType: 'blob' });
      const fileName = res.headers['content-disposition'].split('filename=')[1];
      fileDownload(res.data, fileName);
    },
  },
};
</script>

<style lang="scss" scoped>
.purchase-table {
  width: 100%;
  margin-bottom: 16px;
}

.table-date-header {
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
}

.table-header {
  font-size: 12px;
  font-weight: 300;
  padding: 4px 6px;
  margin: 2px;
}

.table-row {
  background-color: #e9e9e9;
  font-size: 12px;
  text-overflow: ellipsis;
  height: 26px;
  cursor: pointer;

  &:hover {
    background-color: #e2e2e2;
  }
}

.table-cell {
  padding: 8px 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &.primary {
    border-left: $blue 3px solid;
  }
}
</style>
