<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Produk</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getProducts()"></q-btn>
    </portal>

    <div class="row q-gutter-y-sm justify-center items-center q-mb-sm">
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input class="app-input" outlined dense debounce="150" color="blue" bg-color="white" v-model="filter">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row">
      <div class="q-pa-sm" v-for="product in productsFiltered" :key="product.id">
        <q-card class="product-card cursor-pointer shadow-1" @click="openEditDialog(product)">
          <div class="row">
            <div style="width: 100px;">
              <q-img :ratio="1" class="rounded-borders" spinner-size="0px" style="width:90px;" v-if="product.image" :src="product.image" />
              <q-avatar v-else rounded color="primary" text-color="white" size="90px">{{ product.name | avatar }}</q-avatar>
            </div>
            <div style="width: 200px;" class="column">
              <div class="product-title">{{ product.name }}</div>
              <div class="product-description">{{ product.description }}</div>
              <div style="height: 6px;"></div>
              <div class="row product-details">
                <template v-if="product.variants.length > 1">
                  <q-chip
                    v-for="productVariant in product.variants"
                    :key="productVariant.id"
                    class="product-chip text-white"
                    color="blue-5"
                    text-color="white"
                    dense
                  >
                    <span>{{ productVariant.name }}</span>
                  </q-chip>
                </template>
              </div>
              <q-space />
              <div class="product-price" v-if="product.rangePrice.length == 2">
                Rp {{ product.rangePrice[0] | numeric }} - {{ product.rangePrice[1] | numeric }}
              </div>
              <div class="product-price" v-else>Rp {{ product.rangePrice[0] | numeric }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-product-dialog v-model="isCreateDialogOpen" />
    <edit-product-dialog v-model="isEditDialogOpen" :productSelected="productSelected" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import CreateProductDialog from './CreateProductDialog';
import EditProductDialog from './EditProductDialog';

export default {
  name: 'ProductPage',
  components: { CreateProductDialog, EditProductDialog },
  data() {
    return {
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      productSelected: {},
      filter: '',
    };
  },
  computed: {
    ...mapState('product', {
      products: state => state.products,
      isLoading: state => state.isLoading,
    }),
    productsFiltered() {
      const filter = this.filter.toLowerCase();
      if (!filter) return this.products;
      return this.products.filter(product => product.name.toLowerCase().includes(filter));
    },
  },
  mounted() {
    this.getProducts();
  },
  methods: {
    async getProducts() {
      await this.$store.dispatch('product/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(product) {
      this.product = product;
      this.productSelected = await this.$store.dispatch('product/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.product-card {
  padding: 10px;
  width: 330px;
}

.product-title {
  font-family: Proxima-Nova-Alt;
  font-size: 16px;
  font-weight: 800;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.product-description {
  font-size: 11px;
  font-weight: 300;
  color: $grey-9 8;
  height: 24px;
  line-height: 12.5px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.product-price {
  font-family: Proxima-Nova-Alt;
  font-size: 12px;
  font-weight: 800;
}

.product-details {
  margin-left: -4px;
  width: 210px;
  height: 16px;
  overflow: hidden;
}

.product-chip {
  font-family: Proxima-Nova-Alt;
  text-overflow: ellipsis !important;
  max-width: 100px;
  padding: 0px 8px;
  margin: 0px 2px 10px 2px;
  font-size: 10px;
  font-weight: 300;
}
</style>
