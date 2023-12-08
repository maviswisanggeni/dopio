<template>
  <q-card flat class="top-product-card" style="height: 480px; min-height: 480px;">
    <q-card-section class="q-pb-none">
      <div class="text-subtitle">Produk Terjual Terbanyak</div>
    </q-card-section>
    <q-card-section class="q-pt-sm" v-if="products.length != 0">
      <div class="row product-item items-center" v-for="(product, index) in products" :key="index">
        <div class="numbering">#{{ index + 1 }}</div>
        <div style="width: 8px;"></div>
        <q-img :ratio="1" class="rounded-borders" spinner-size="0px" style="width:60px;" v-if="product.image" :src="product.image" />
        <q-avatar v-else rounded color="primary" text-color="white" size="60px">{{ product.name | avatar }}</q-avatar>
        <div style="width: 16px;"></div>
        <div style="height: 62px;" class="column justify-between items-between">
          <div class="product-name">{{ product.name }}</div>
          <div class="product-sold">Terjual: {{ product.totalItemSold | numeric }}</div>
          <q-space></q-space>
          <div class="product-price">Rp {{ product.price | numeric }}</div>
        </div>
      </div>
    </q-card-section>
    <q-card-section v-else>
      <div class="column items-center justify-center" style="height: 440px;">
        <q-icon class="q-mb-sm" size="28px" name="sentiment_dissatisfied"></q-icon>
        <div>Tidak ada Penjualan</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'TopProductList',
  data() {
    return {
      products: [],
    };
  },

  created() {
    this.getTopProducts();
  },

  methods: {
    async getTopProducts() {
      const res = await this.$axios.get('/dashboard/top-product');
      this.products = res.data;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-product-card {
  font-family: Proxima-Nova-Alt;
  border-radius: 1rem;
}

.numbering {
  width: 32px;
  font-size: 18px;
  font-weight: bold;
  color: $blue;
}

.product-item {
  padding: 12px 4px;
  border-bottom: 1px solid $grey-4;

  &:last-child {
    border-bottom: 0;
  }
}

.product-name {
  font-size: 12px;
}

.product-sold {
  font-size: 11px;
  color: $grey-7;
}

.product-price {
  font-size: 11px;
  color: $grey-9;
}
</style>
