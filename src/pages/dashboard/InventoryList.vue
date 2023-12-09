<template>
  <q-card flat class="inventory-card" style="height: 480px; min-height: 480px;">
    <q-card-section v-if="inventories.length != 0">
      <div class="row justify-between q-mb-md">
        <div class="text-subtitle q-mb-sm">Persediaan</div>
        <div class="view-more" @click="$router.push('inventory')">view more</div>
      </div>
      <div class="row q-col-gutter-y-md q-col-gutter-x-xl">
        <div class="row col-sm-12 col-md-6" v-for="(inventory, index) in inventories" :key="index">
          <q-img :ratio="1" class="rounded-borders" spinner-size="0px" style="width:62px;" v-if="inventory.image" :src="inventory.image" />
          <q-avatar v-else rounded color="grey" text-color="white" size="62px">{{ inventory.fullName | avatar }}</q-avatar>
          <div style="height: 68px;" class="column justify-between items-between">
            <div class="q-ml-sm inventory-name">{{ inventory.fullName }}</div>
            <div class="row q-ml-xs">
              <q-chip class="text-white status-badge" color="blue">{{ inventory.categoryName ? inventory.categoryName : 'Bahan' }}</q-chip>
              <q-chip v-if="getStatus(inventory) == 'AVAILABLE'" class="text-white status-badge" color="positive">Stok Tersedia</q-chip>
              <q-chip v-if="getStatus(inventory) == 'ALMOST_OUT'" class="text-white status-badge" color="orange">Stok Hampir Habis</q-chip>
              <q-chip v-if="getStatus(inventory) == 'EMPTY'" class="text-white status-badge" color="red">Stok Kosong</q-chip>
            </div>
          </div>
          <q-space />
          <div class="column justify-between items-center">
            <div class="sm-text">Jumlah</div>
            <div class="value-text">{{ inventory.stock }}</div>
            <div class="sm-text">{{ inventory.unit ? inventory.unit.name : 'Unit' }}</div>
            <div style="height: 4px;"></div>
          </div>
          <div style="width: 16px;"></div>
        </div>
      </div>
    </q-card-section>
    <q-card-section v-else>
      <div class="column items-center justify-center" style="height: 480px;">
        <q-icon class="q-mb-sm" size="28px" name="sentiment_dissatisfied"></q-icon>
        <div>Tidak ada Persediaan</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'InventoryList',
  data() {
    return {
      pagination: { page: 1, rowsPerPage: 25, rowsNumber: 25 },
      inventories: [],
    };
  },
  computed: {
    ...mapState('ingredient', {
      ingredients: state => state.ingredients,
      isLoading: state => state.isLoading,
    }),
  },
  mounted() {
    this.getInventories();
  },
  methods: {
    getStatus(inventory) {
      if (inventory.stock <= 0) return 'EMPTY';
      if (inventory.alertIn === null) return 'AVAILABLE';
      if (inventory.stock <= inventory.alertIn) return 'ALMOST_OUT';
      return 'AVAILABLE';
    },
    async getInventories() {
      const ingredients = this.$store.state.ingredient.ingredients.filter(ingredient => ingredient.stock != null);
      ingredients.forEach(ingredient => (ingredient.fullName = ingredient.name));

      const productVariants = this.$store.state.product.productVariants.filter(pv => pv.stock != null);
      this.inventories = [...ingredients, ...productVariants]
        .sort((a, b) => {
          if (a.stock == 0) return -1;
          if (b.stock == 0) return 1;
          return a.stock - a.alertIn ?? 0 - (b.stock - b.alertIn ?? 0);
        })
        .slice(0, 10);
    },
  },
};
</script>

<style lang="scss" scoped>
.inventory-card {
  font-family: Proxima-Nova-Alt;
  border-radius: 1rem;
}

.inventory-name {
  font-size: 12px;
  font-weight: 700;
}

.status-badge {
  padding: 6px;
  font-size: 11px;
  border-radius: 8px;
  margin: 2px 2px 6px 2px;
}

.sm-text {
  font-weight: 300;
  font-size: 11px;
  color: $grey-7;
}

.value-text {
  font-size: 14px;
  font-weight: bold;
}
</style>
