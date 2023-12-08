<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Laporan Penjualan Per Item</span>
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
          <div class="text-subtitle">Penjualan Per Item</div>
          <div v-if="!filter.endDate">{{ filter.startDate | isoDateToLocale }}</div>
          <div v-else>{{ filter.startDate | isoDateToLocale }} - {{ filter.endDate | isoDateToLocale }}</div>
          <div style="height: 32px;"></div>
        </div>
        <q-table class="app-sticky-table" :data="items" :columns="columns" :loading="isLoading" :rows-per-page-options="[0]" dense flat hide-bottom>
          <template v-slot:body="props">
            <q-tr>
              <q-td class="text-left" key="name">{{ props.row.name }}</q-td>
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
  name: 'SaleByItemPage',
  mixins: [reportGuard],
  data() {
    const now = new Date();
    const startDate = date.formatDate(date.startOfDate(now, 'month'), 'YYYY-MM-DD');
    const endDate = date.formatDate(date.endOfDate(now, 'month'), 'YYYY-MM-DD');

    return {
      filter: { startDate, endDate },
      isLoading: true,
      columns: [
        { name: 'name', label: 'Nama Item', align: 'left' },
        { name: 'totalItemSold', label: 'Total Item Terjual', align: 'center' },
        { name: 'total', label: 'Total (IDR)', align: 'right' },
        { name: 'totalTax', label: 'Total Pajak (IDR)', align: 'right' },
        { name: 'grandTotal', label: 'Grand Total (IDR)', align: 'right' },
      ],
      items: [],
    };
  },
  watch: {
    'filter.startDate'(value) {
      if (value && !this.filter.endDate) {
        this.filter.endDate = value;
        return;
      }
      this.getSaleByItem();
    },
    'filter.endDate'() {
      this.getSaleByItem();
    },
  },
  computed: {
    grandtotalItemSold() {
      return this.items.reduce((sum, item) => sum + item.totalItemSold, 0);
    },
    grandTotalGrossIncome() {
      return this.items.reduce((sum, item) => sum + item.total, 0);
    },
    grandTotalTax() {
      return this.items.reduce((sum, item) => sum + item.totalTax, 0);
    },
    grandTotalAll() {
      return this.items.reduce((sum, item) => sum + item.grandTotal, 0);
    },
  },
  mounted() {
    this.getSaleByItem();
  },
  methods: {
    async getSaleByItem() {
      if (!this.filter.startDate || !this.filter.endDate) return;
      const params = {};
      const { startDate, endDate } = this.filter;
      params.startDate = convertUTC(startDate);
      params.endDate = convertUTC(date.addToDate(new Date(endDate), { days: 1 }));

      try {
        this.isLoading = true;
        const res = await this.$axios.get('/report/sale-by-item', { params });
        this.items = res.data;
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
