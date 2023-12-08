<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Laporan Penjualan Per Kategori</span>
      <q-btn round dense size="12px" flat icon="print" color="blue" @click="print">
        <q-tooltip>Cetak</q-tooltip>
      </q-btn>
    </portal>

    <div class="row q-gutter-sm justify-start items-center q-mb-md ">
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.startDate" name="Tanggal Mulai" />
      </div>
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.endDate" name="Tanggal Selesai" />
      </div>
    </div>

    <q-card>
      <vue-easy-print tableShow ref="easyPrint">
        <div class="text-center print-only">
          <div class="text-subtitle">Laporan Penjualan Per Item</div>
          <div v-if="!filter.endDate">{{ filter.startDate | isoDateToLocale }}</div>
          <div v-else>{{ filter.startDate | isoDateToLocale }} - {{ filter.endDate | isoDateToLocale }}</div>
          <div style="height: 32px;"></div>
        </div>
        <q-table
          class="app-sticky-table"
          flat
          :data="categories"
          :columns="columns"
          :loading="isLoading"
          :pagination="{ page: 1, rowsPerPage: 0 }"
          hide-bottom
          dense
        >
          <template v-slot:body="props">
            <q-tr>
              <q-td class="text-left" key="name"> {{ props.row.name ? props.row.name : 'Tidak Terkategori' }} </q-td>
              <q-td class="text-center" key="totalItemSold">{{ props.row.totalItemSold }} Item</q-td>
              <q-td class="text-right" key="total">{{ props.row.total | numeric }} </q-td>
              <q-td class="text-right" key="totalTax">{{ props.row.totalTax | numeric }} </q-td>
              <q-td class="text-right" key="grandTotal">{{ props.row.grandTotal | numeric }} </q-td>
            </q-tr>
          </template>
          <template v-slot:bottom-row>
            <q-tr>
              <q-th class="text-left">Grand Total</q-th>
              <q-th class="text-center">{{ grandtotalItemSold | numeric }} Item</q-th>
              <q-th class="text-right">{{ grandTotalGrossIncome | numeric }} </q-th>
              <q-th class="text-right">{{ grandTotalTax | numeric }} </q-th>
              <q-th class="text-right">{{ grandTotalAll | numeric }} </q-th>
            </q-tr>
          </template>
        </q-table>
      </vue-easy-print>
    </q-card>
  </q-page>
</template>

<script>
import { date } from 'quasar';
import { convertUTC } from 'src/helpers/object.helper';
import reportGuard from 'src/guards/report.guard';

export default {
  name: 'SaleByCategoryReportPage',
  // mixins: [reportGuard],
  data() {
    const now = new Date();
    const startDate = date.formatDate(date.startOfDate(now, 'month'), 'YYYY-MM-DD');
    const endDate = date.formatDate(date.endOfDate(now, 'month'), 'YYYY-MM-DD');

    return {
      filter: { startDate, endDate },
      isLoading: true,
      columns: [
        { name: 'name', label: 'Nama Kategori', field: 'name', align: 'left' },
        { name: 'totalItemSold', label: 'Total Item Terjual', field: 'totalItemSold', align: 'center' },
        { name: 'total', label: 'Total (IDR)', field: 'total', align: 'right' },
        { name: 'totalTax', label: 'Total Pajak (IDR)', align: 'right' },
        { name: 'grandTotal', label: 'Grand Total (IDR)', align: 'right' },
      ],
      categories: [],
    };
  },
  watch: {
    'filter.startDate'(value) {
      if (value && !this.filter.endDate) {
        this.filter.endDate = value;
        return;
      }
      this.getSaleByCategory();
    },
    'filter.endDate'() {
      this.getSaleByCategory();
    },
  },
  mounted() {
    this.getSaleByCategory();
  },
  computed: {
    grandtotalItemSold() {
      return this.categories.reduce((sum, category) => sum + category.totalItemSold, 0);
    },
    grandTotalGrossIncome() {
      return this.categories.reduce((sum, category) => sum + category.total, 0);
    },
    grandTotalTax() {
      return this.categories.reduce((sum, category) => sum + category.totalTax, 0);
    },
    grandTotalAll() {
      return this.categories.reduce((sum, category) => sum + category.grandTotal, 0);
    },
  },
  methods: {
    async getSaleByCategory() {
      if (!this.filter.startDate || !this.filter.endDate) return;
      const params = {};
      const { startDate, endDate } = this.filter;
      params.startDate = convertUTC(startDate);
      params.endDate = convertUTC(date.addToDate(new Date(endDate), { days: 1 }));
      try {
        this.isLoading = true;
        const res = await this.$axios.get('/report/sale-by-category', { params: params });
        this.categories = res.data;
      } finally {
        this.isLoading = false;
      }
    },
    print() {
      this.$refs.easyPrint.print();
    },
  },
};
</script>

<style lang="sass" scoped></style>
