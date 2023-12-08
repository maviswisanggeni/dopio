<template>
  <q-card flat class="top-sale-card">
    <q-card-section v-if="sales.length != 0">
      <div class="row justify-between">
        <div class="text-subtitle q-mb-sm">Penjualan Terakhir</div>
        <div class="view-more" @click="$router.push('sale')">view more</div>
      </div>
      <div class="column q-mb-sm" v-for="(sale, index) in sales" :key="index">
        <div class="row sale-item items-start">
          <div class="dinetable-number-box row text-center items-center" v-if="sale.dineTable">
            <div class="col-12">Meja</div>
            <div class="col-12 dine-table-label">{{ sale.dineTable.label }}</div>
          </div>
          <div class="dinetable-number-box row text-center items-center" v-else>
            <div class="col-12">Take Away</div>
          </div>
          <div style="width: 12px;"></div>
          <div style="height: 60px; width: 70%;" class="row justify-between items-between">
            <div class="sale-no col-12">{{ sale.orderNo }}</div>
            <div class="sale-date col-12">{{ sale.createdAt | timeago }}</div>
            <div class="sale-price col-12">{{ sale.items }}</div>
          </div>
        </div>
        <q-separator class="q-my-xs" />
        <div class="row text-weight-bold justify-between total-item">
          <div>{{ sale.totalItem }} Item{{ sale.totalItem == 1 ? '' : 's' }}</div>
          <div>Rp {{ sale.grandTotal | numeric }}</div>
        </div>
        <q-separator class="q-my-xs" />
      </div>
    </q-card-section>
    <q-card-section v-else>
      <div class="column items-center justify-center" style="height: 480px;">
        <q-icon class="q-mb-sm" size="28px" name="sentiment_dissatisfied"></q-icon>
        <div>Tidak ada Penjualan</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'TopSaleList',
  data() {
    return {
      sales: [],
    };
  },

  created() {
    this.getSales();
  },

  methods: {
    async getSales() {
      const res = await this.$axios.get('sale/', { params: { limit: 4 } });
      const sales = res.data.items;
      for (const sale of sales) {
        sale.totalItem = sale.saleDetails.reduce((sum, saleDetail) => sum + saleDetail.qty, 0);
        sale.items = sale.saleDetails.map(saleDetail => saleDetail.qty + 'x ' + saleDetail.name).join(', ');
      }
      this.sales = sales;
    },
  },

  sockets: {
    saleUpdated(sale) {
      const index = this.sales.findIndex(item => item.id == sale.id);
      sale.totalItem = sale.saleDetails.reduce((sum, saleDetail) => sum + saleDetail.qty, 0);
      sale.items = sale.saleDetails.map(saleDetail => saleDetail.qty + 'x ' + saleDetail.name).join(', ');
      if (index < 0) {
        this.sales.unshift(sale);
        this.sales.pop();
      }
      this.$set(this.sales, index, sale);
    },
    saleCanceled(sale) {
      const index = this.sales.findIndex(item => item.id == sale.id);
      if (index < 0) return;
      this.$delete(this.sales, index, sale);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-sale-card {
  font-family: Proxima-Nova-Alt;
  border-radius: 1rem;
  height: 500px;
}

.dinetable-number-box {
  width: 55px;
  height: 55px;
  padding: 8px;
  background-color: $blue-5;
  border-radius: 4px;
  font-size: 11px;
  color: white;
}

.dine-table-label {
  font-size: 18px;
  font-weight: 700;
}

.sale-item {
  padding: 4px;
  max-height: 70px;
  min-height: 70px;
}

.sale-no {
  font-size: 12px;
  font-weight: 700;
}

.sale-date {
  font-size: 11px;
  color: $grey-7;
}

.sale-price {
  font-size: 11px;
  color: $grey-9;
  height: 32px;
  display: block; /* or inline-block */
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
}

.total-item {
  font-size: 12px;
  margin-left: 8px;
}
</style>
