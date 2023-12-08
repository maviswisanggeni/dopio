<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Dashboard</span>
    </portal>

    <summary-list />

    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-xs-12 col-sm-12 col-md-8">
        <gross-income-chart />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4">
        <sale-list />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-sm q-mb-md">
      <div class="col-xs-12 col-sm-12 col-md-8">
        <inventory-list />
      </div>
      <div class="col-xs-12 col-sm-12 col-md-4">
        <top-product-list />
      </div>
    </div>
  </q-page>
</template>

<script>
import SummaryList from './SummaryList';
import GrossIncomeChart from './GrossIncomeChart';
import SaleList from './SaleList';
import InventoryList from './InventoryList';
import TopProductList from './TopProductList';

export default {
  name: 'PageIndex',
  components: { SummaryList, GrossIncomeChart, SaleList, InventoryList, TopProductList },
  data() {
    return {
      loading: true,
    };
  },
  computed: {},
  async mounted() {
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.text-subtitle {
  font-family: Proxima-Nova-Alt;
  font-weight: 700;
  font-size: 18px;
  color: $grey-9;
}
</style>
