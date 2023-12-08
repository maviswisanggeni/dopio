<template>
  <base-form ref="form">
    <div class="row items-center justify-center q-pa-xs">
      <q-btn dense flat icon="arrow_back" class="text-grey" size="10px" @click="$emit('back')" />
      <q-separator vertical class="q-mx-xs" />
      <q-space />
      <div class="form-title text-grey-8">{{ product.name }}</div>
      <q-space />
      <q-separator vertical class="q-mx-xs" />
      <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
    </div>
    <q-separator />

    <q-card-section class="scroll" style="height: calc(100vh - 110px);">
      <div class="row q-col-gutter-y-md">
        <div class="col-12">
          <base-text-input v-model="productVariant.name" name="Nama Variasi" rules="required" />
        </div>

        <div class="col-12">
          <base-money-input v-model="productVariant.price" name="Harga" rules="required" />
        </div>

        <!-- Inventory -->
        <div class="col-12" v-if="product.hasStock">
          <div class="row q-col-gutter-sm">
            <div class="col-5">
              <base-money-input name="Jumlah Stok" v-model="productVariant.stock" rules="required" :disable="isSetStock && productVariant.hasStock" />
            </div>
            <div class="col-3 text-center">
              <div class="label-input">Notifikasi</div>
              <q-checkbox
                style="margin-left: -6px; font-size: 10px; line-height: 12px;"
                class="label-input circle text-grey-7"
                v-model="productVariant.isAlert"
                size="xs"
              />
            </div>
            <div class="col-4">
              <base-money-input name="Notifikasi Dalam" v-model="productVariant.alertIn" />
            </div>
          </div>
        </div>

        <!-- Recipe -->
        <div class="col-12" v-if="product.hasRecipe">
          <div class="label-input q-mb-sm">Resep</div>
          <div class="q-mb-xs" v-for="(recipeDetail, index) in productVariant.recipeDetails" :key="index">
            <div class="row q-mb-xs item-text" @click="selectRecipe(recipeDetail)">
              <div>{{ recipeDetail.ingredient.name }}</div>
              <q-space></q-space>
              <div class="q-mr-xs">{{ recipeDetail.qty }}</div>
              <div>{{ recipeDetail.ingredient.unit.name }}</div>
            </div>
            <q-separator />
          </div>
          <div class="col-12 q-my-sm add-label text-primary text-weight-bold cursor-pointer" @click="selectRecipe(null)">
            <q-icon name="add" size="14px" />
            <span>Tambah Bahan</span>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <new-save-btn @click="save" />
    </q-card-section>
  </base-form>
</template>

<script>
import { isEmpty } from 'lodash';

export default {
  name: 'CreateProductVariantForm',
  props: {
    product: { type: Object },
    item: { type: Object },
    isSetStock: { type: Boolean },
  },
  data() {
    return {
      productVariant: {},
      isSetRecipe: false,
    };
  },
  watch: {
    value(val) {
      if (!val) return;
      if (!this.item) return;
    },
  },

  created() {
    this.setProductVariant();
  },

  methods: {
    setProductVariant() {
      if (isEmpty(this.item)) {
        this.productVariant = { name: null, stock: null, isAlert: false, alertIn: 0, hasStock: false, hasStock: false, recipeDetails: [] };
        return;
      }
      this.productVariant = { ...this.item, isAlert: false, hasStock: this.item.stock == null ? false : true };
      if (this.product.hasRecipe) this.isSetRecipe = true;
    },
    onHasStockChanged(val) {
      if (val == false) return;
      this.productVariant.stock = null;
      this.productVariant.alertIn = null;
      this.productVariant.isAlert = false;
    },
    onHasRecipeChanged(val) {
      if (val == true) return;
    },
    selectRecipe(recipeDetail) {
      this.$emit('selectRecipeDetail', { productVariant: this.productVariant, recipeDetail });
    },
    async save() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;
      this.$emit('save', this.productVariant);
      setTimeout(() => this.$emit('back'), 1);
    },
    async destroy() {
      this.$emit('destroy');
      this.$emit('back');
    },
  },
};
</script>

<style lang="scss" scoped>
.add-label {
  font-size: 11px;
}

.item-text {
  font-weight: 300;
  font-size: 12px;
  padding: 0px 2px;
  cursor: pointer;
}
</style>
