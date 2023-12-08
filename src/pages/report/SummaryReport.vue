<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-sm">Laporan Ringkasan</span>
      <q-btn round dense size="12px" flat icon="print" color="blue" @click="print">
        <q-tooltip>Cetak</q-tooltip>
      </q-btn>
    </portal>

    <div class="row q-gutter-sm justify-start items-center q-mb-sm">
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.startDate" name="Tanggal Mulai" />
      </div>
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.endDate" name="Tanggal Selesai" />
      </div>
    </div>

    <q-card class="summary-card">
      <q-card-section v-if="!isLoading">
        <vue-easy-print tableShow ref="easyPrint">
          <div class="text-center print-only">
            <div class="text-subtitle">Laporan Ringkasan</div>
            <div v-if="!filter.endDate">{{ filter.startDate | isoDateToLocale }}</div>
            <div v-else>{{ filter.startDate | isoDateToLocale }} - {{ filter.endDate | isoDateToLocale }}</div>
            <div style="height: 32px;"></div>
          </div>
          <div class="text-subtitle">Penjualan</div>
          <q-markup-table class="q-mb-md" flat dense>
            <tr>
              <td class="text-left">Total Transaksi Penjualan</td>
              <td class="text-right">{{ summary.saleSummary.totalSale | numeric }} Transaksi</td>
            </tr>
            <tr>
              <td class="text-left">Item Terjual</td>
              <td class="text-right">{{ summary.saleSummary.totalItemSold | numeric }} Item</td>
            </tr>
          </q-markup-table>

          <div class="text-subtitle">Pemasukan</div>
          <q-markup-table class="q-mb-md" flat dense>
            <tr>
              <td class="text-left">Kas Masuk</td>
              <td class="text-right">{{ summary.cashSummary.totalCashIn | numeric }}</td>
            </tr>
            <tr v-if="!company.isIncludeTaxEnabled">
              <td class="text-left">Penjualan</td>
              <td class="text-right">{{ summary.saleSummary.totalIncome | numeric }}</td>
            </tr>
            <tr v-if="company.isIncludeTaxEnabled">
              <td class="text-left">Penjualan</td>
              <td class="text-right">{{ summary.saleSummary.totalVirtualIncome | numeric }}</td>
            </tr>
            <tr v-if="company.isIncludeTaxEnabled">
              <td class="text-left">Pajak Penjualan</td>
              <td class="text-right">{{ summary.saleSummary.totalVirtualTax | numeric }}</td>
            </tr>
            <tr>
              <th class="text-left">Total Pendapatan Kotor</th>
              <th class="text-right">Rp {{ totalGrossIncome | numeric }}</th>
            </tr>
          </q-markup-table>

          <div class="text-subtitle">Pengeluaran</div>
          <q-markup-table class="q-mb-md" flat dense>
            <tr>
              <td class="text-left">Kas Keluar</td>
              <td class="text-right">{{ summary.cashSummary.totalCashOut | numeric }}</td>
            </tr>
            <tr>
              <td class="text-left">Pembelian</td>
              <td class="text-right">{{ summary.purchaseSummary.grandTotalPurchase | numeric }}</td>
            </tr>
            <tr>
              <th class="text-left">Total Pengeluaran</th>
              <th class="text-right">Rp {{ totalExpense | numeric }}</th>
            </tr>
          </q-markup-table>

          <div class="row justify-between q-mr-md">
            <div class="text-subtitle">Total Pendapatan Bersih</div>
            <div class="text-bold">Rp {{ totalNetIncome | numeric }}</div>
          </div>
        </vue-easy-print>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import { date } from 'quasar';
import { convertUTC } from 'src/helpers/object.helper';
import reportGuard from 'src/guards/report.guard';

export default {
  name: 'SummaryReportPage',
  mixins: [reportGuard],
  data() {
    const now = new Date();
    const startDate = date.formatDate(date.startOfDate(now, 'month'), 'YYYY-MM-DD');
    const endDate = date.formatDate(date.endOfDate(now, 'month'), 'YYYY-MM-DD');
    return {
      filter: { startDate, endDate },
      summary: null,
      isLoading: true,
      totalIncome: 0,
    };
  },
  watch: {
    'filter.startDate'(value) {
      if (value && !this.filter.endDate) {
        this.filter.endDate = value;
        return;
      }
      this.getReport();
    },
    'filter.endDate'() {
      this.getReport();
    },
  },
  computed: {
    totalGrossIncome() {
      if (!this.summary) return 0;
      return this.summary.cashSummary.totalCashIn + this.summary.saleSummary.totalGrossIncome;
    },
    totalExpense() {
      if (!this.summary) return 0;
      return this.summary.cashSummary.totalCashOut + this.summary.purchaseSummary.grandTotalPurchase;
    },
    totalNetIncome() {
      if (!this.summary) return 0;
      return this.totalGrossIncome - this.totalExpense;
    },
    ...mapState('auth', {
      company: state => state.company,
    }),
  },
  mounted() {
    this.getReport();
  },
  methods: {
    async getReport() {
      if (!this.filter.startDate || !this.filter.endDate) return;
      const params = {};
      const { startDate, endDate } = this.filter;
      params.startDate = convertUTC(startDate);
      params.endDate = convertUTC(date.addToDate(new Date(endDate), { days: 1 }));
      try {
        this.isLoading = true;
        const res = await this.$axios.get('/report/summary', { params: params });
        this.summary = res.data;
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

<style lang="scss" scoped>
.summary-card {
  font-family: Proxima-Nova-Alt;
}

.q-table tbody td:before {
  background-color: transparent;
}
</style>
