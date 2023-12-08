<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Penjualan</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getSales()"></q-btn>
      <q-btn round dense size="12px" flat icon="mdi-microsoft-excel" color="green" @click="downloadExcel()">
        <q-tooltip>Download Excel</q-tooltip>
      </q-btn>
    </portal>

    <div class="row q-col-gutter-sm justify-center items-end q-mb-md ">
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.startDate" name="Tanggal Mulai" />
      </div>
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.endDate" name="Tanggal Selesai" />
      </div>
      <div class="col-xs-12 col-sm-4 col-md-2 col-lg-2">
        <base-select-input name="Status" v-model="filter.mode" :options="options" />
      </div>
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input class="app-input" outlined dense debounce="200" color="blue" bg-color="white" v-model="filter.search">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      :data="sales"
      :columns="columns"
      @request="getSales"
      :pagination.sync="pagination"
      :filter="filter"
      :rows-per-page-options="[25, 50, 100]"
      :loading="isLoading"
      class="app-sticky-table"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" style="top: 30px;" size="28px" />
      </template>
      <template v-slot:body="props">
        <q-tr @click="openEditDialog(props.row)" style="cursor:pointer" :props="props">
          <q-td key="code" :props="props"> {{ props.row.orderNo }}</q-td>
          <q-td key="createdAt" :props="props">{{ props.row.createdAt | dateTime }}</q-td>
          <q-td key="dineTable.label" :props="props">{{ props.row.dineTable ? props.row.dineTable.label : '-' }}</q-td>
          <q-td key="cashier.name" :props="props">{{ props.row.cashier.name }}</q-td>
          <q-td key="grandTotal" :props="props">{{ props.row.grandTotal | numeric }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <edit-sale-dialog v-model="isEditDialogOpen" :saleSelected="sale" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import EditSaleDialog from './EditSaleDialog';
import fileDownload from 'js-file-download';

export default {
  name: 'SalePage',
  components: { EditSaleDialog },

  data() {
    return {
      filter: { search: '', startDate: null, endDate: null },
      sale: null,
      columns: [
        { name: 'code', label: 'Nomor', align: 'left', headerStyle: 'width: 100px;' },
        { name: 'createdAt', label: 'Tanggal', align: 'left', headerStyle: 'width: 100px;' },
        { name: 'dineTable.label', label: 'Nomor Meja', align: 'center', headerStyle: 'width: 100px;' },
        { name: 'cashier.name', label: 'Kasir', align: 'left', headerStyle: 'width: 100px;' },
        { name: 'grandTotal', label: 'Grand Total', align: 'right' },
      ],
      pagination: { page: 1, rowsPerPage: 25, rowsNumber: 25 },
      SaleSelected: null,
      isEditDialogOpen: false,
      options: [
        { value: null, label: 'Semua' },
        { value: 'isPaid:true', label: 'Sudah Bayar' },
        { value: 'isDeleted:true', label: 'Terhapus' },
      ],
    };
  },

  computed: {
    ...mapState('sale', {
      sales: state => state.sales,
      isLoading: state => state.isLoading,
    }),
  },

  mounted() {
    this.getSales();
  },

  methods: {
    async getSales(props) {
      if (props) this.pagination = props.pagination;
      const { meta } = await this.$store.dispatch('sale/get', this);
      this.pagination.rowsNumber = meta.totalItems;
      this.pagination.rowsPerPage = meta.itemsPerPage;
    },
    async openEditDialog(sale) {
      this.sale = sale;
      this.sale = await this.$store.dispatch('sale/show', this);
      this.isEditDialogOpen = true;
    },
    async downloadExcel() {
      const res = await this.$axios.get('/sale/excel', { params: this.filter, responseType: 'blob' });
      const fileName = res.headers['content-disposition'].split('filename=')[1];
      fileDownload(res.data, fileName);
    },
  },

  sockets: {
    saleUpdated(sale) {
      this.$store.commit('sale/createOrUpdateSale', sale);
    },
    saleCanceled(sale) {
      this.$store.commit('sale/deleteSale', sale);
    },
  },
};
</script>

<style lang="scss" scoped></style>
