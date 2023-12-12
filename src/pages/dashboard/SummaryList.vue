<template>
  <div class="row q-col-gutter-md q-pt-sm" v-if="!isLoading">
    <div class="col-xs-12 col-sm-6 col-md-3">
      <q-card flat class="card-summary">
        <q-card-section class="row justify-between items-center" style="height: 100%;">
          <div class="column">
            <div class="summary-title-rp">{{ summary.today.totalGrossIncome | numeric }}</div>
            <div class="summary-text">Pendapatan hari ini</div>
          </div>
          <q-avatar round color="white" text-color="blue">
            <span style="font-weight: 800">Rp</span>
          </q-avatar>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-3">
      <q-card flat class="card-summary">
        <q-card-section class="row justify-between items-center" style="height: 100%;">
          <div class="column">
            <div class="summary-title">{{ summary.today.totalSale | numeric }}</div>
            <div class="summary-text">Penjualan hari ini</div>
          </div>
          <q-avatar round color="white" text-color="blue" icon="receipt" />
        </q-card-section>
      </q-card>
    </div>

    <div class="col-xs-12 col-sm-6 col-md-3">
      <q-card flat class="card-summary">
        <q-card-section class="row justify-between items-center" style="height: 100%;">
          <div class="column">
            <div class="summary-title">{{ summary.today.totalItemSold | numeric }}</div>
            <div class="summary-text">Menu terjual hari ini</div>
          </div>
          <q-avatar round color="white" text-color="blue" icon="fastfood" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SummaryList',

  data() {
    return {
      isLoading: true,
      summary: {},
    };
  },

  mounted() {
    this.loadSummary();
  },

  methods: {
    async loadSummary() {
      this.isLoading = true;
      const res = await this.$axios.get('/dashboard/summary');
      this.summary = res.data;
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-summary {
  font-family: Proxima-Nova-Alt;
  height: 90px;
  color: white;
  background-color: #fff;
  // background: linear-gradient(to right, #1c98f9 0%, #0c4681 100%);
  background: linear-gradient(to right, $blue-7 0%, $light-blue-3 100%);
  box-shadow: 0px 12px 23px 0px rgba(62, 63, 122, 0.04) !important;
  border-radius: 1rem;
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
}

.summary-title-rp {
  font-size: 18px;
  font-weight: 700;
  height: 30px;
}

.summary-text {
  font-size: 12px;
}
</style>
