<template>
  <q-btn size="12px" dense round flat icon="notifications" class="q-mr-sm" color="grey-8">
    <q-badge size="12px" align="top" color="blue" floating>{{ inventories.length }}</q-badge>
    <q-menu>
      <q-list dense style="min-width: 320px;">
        <div class="notification" v-for="(inventory, index) in inventories" :key="index">
          <q-item v-if="inventory.status == 'EMPTY'" class="row items-center justify-center" dense>
            <q-icon name="circle" color="red" size="8px" class="q-mr-sm"></q-icon>
            <q-item-section>Stok "{{ inventory.label }}" kosong</q-item-section>
          </q-item>
          <q-item v-else class="row notification items-center justify-center" dense>
            <q-icon name="circle" color="orange" size="8px" class="q-mr-sm"></q-icon>
            <q-item-section>Stok "{{ inventory.label }}" hampir habis</q-item-section>
          </q-item>
          <q-separator />
        </div>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  computed: {
    inventories() {
      const productVariants = this.$store.state.product.productVariants
        .filter(productVariant => {
          if (productVariant.stock == null || productVariant.isAlert == false) return false;
          productVariant.status = this.getStatus(productVariant);
          if (productVariant.status == 'AVAILABLE') return false;
          return true;
        })
        .map(productVariant => {
          return { label: productVariant.fullName, type: 'PRODUCT', ...productVariant };
        });

      const ingredients = this.$store.state.ingredient.ingredients
        .filter(ingredient => {
          if (ingredient.stock == null || ingredient.isAlert == false) return false;
          ingredient.status = this.getStatus(ingredient);
          if (ingredient.status == 'AVAILABLE') return false;
          return true;
        })
        .map(ingredient => {
          return { label: ingredient.name, type: 'INGREDIENT', ...ingredient };
        });

      return [...productVariants, ...ingredients].sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  methods: {
    getStatus(inventory) {
      if (inventory.stock <= 0) return 'EMPTY';
      if (inventory.alertIn === null) return 'AVAILABLE';
      if (inventory.stock <= inventory.alertIn) return 'ALMOST_OUT';
      return 'AVAILABLE';
    },
  },
};
</script>

<style lang="scss">
.notification {
  font-family: Proxima-Nova-Alt;
  font-size: 12px;
}
</style>
