<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-tab-panels style="width: 420px; overflow: hidden;" v-model="panel" animated>
      <q-tab-panel name="product" style="padding: 0px;">
        <base-form ref="form" :onSubmit="update">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Ubah Produk</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
          </div>
          <q-separator />

          <q-card-section class="scroll" style="height: calc(100vh - 110px);">
            <div class="row q-col-gutter-sm">
              <div class="row items-start full-width">
                <div class="q-mt-sm" style="width: 105px">
                  <image-crop-upload size="95px" v-model="product.image" :name="product.name" />
                </div>
                <div class="row col q-col-gutter-x-sm">
                  <div class="col-12  q-mb-sm">
                    <base-text-input name="Nama Produk" v-model="product.name" rules="required" />
                  </div>
                  <div class="col-6">
                    <base-select-input
                      name="Kategori"
                      v-model="product.categoryId"
                      :options="categories"
                      option-value="id"
                      option-label="name"
                      filter
                    />
                  </div>
                  <div class="col-6">
                    <base-money-input v-if="product.variants.length == 1" name="Harga" v-model="product.variants[0].price" rules="required" />
                    <div v-if="product.variants.length > 1">
                      <div class="label-input">Harga</div>
                      <div class="row label-input items-center justify-start" style="height: 32px;">
                        <div class="q-mr-sm">Rp</div>
                        <div v-if="product.rangePrice.length == 1">{{ product.rangePrice[0] | numeric }}</div>
                        <div v-else>{{ product.rangePrice[0] | numeric }} - {{ product.rangePrice[1] | numeric }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12">
                <base-text-area name="Deskripsi" v-model="product.description" rows="3" />
              </div>

              <div class="col-12 q-mt-sm">
                <div class="label-input">Extra</div>
                <div class="row" style="margin: 0px 0px 4px -4px;">
                  <div class="col-4" v-for="extra in extras" :key="extra.id">
                    <q-checkbox class="checkbox-input" :label="extra.name" v-model="extra.isSelected" size="xs" />
                  </div>
                </div>
              </div>

              <!-- Dont have Inventory -->
              <div class="col-12" v-if="!isSetStock && !product.hasRecipe">
                <div class="row justify-between">
                  <div class="label-input">Kontrol Stok</div>
                  <q-toggle size="28px" v-model="product.hasStock" dense @input="onHasStockChanged" />
                </div>
                <q-separator class="q-mt-sm" />
              </div>

              <!-- Dont have Recipe -->
              <div class="col-12" v-if="!isSetRecipe && !product.hasStock">
                <div class="row justify-between">
                  <div class="label-input">Menggunakan Resep</div>
                  <q-toggle size="28px" v-model="product.hasRecipe" dense @input="onHasRecipeChanged" />
                </div>
                <q-separator class="q-mt-sm" />
              </div>

              <!-- 1 Inventory -->
              <div class="col-12" v-if="product.variants.length == 1 && product.hasStock">
                <div class="row q-col-gutter-md q-mb-sm">
                  <div class="col-5">
                    <base-money-input name="Jumlah Stok" v-model="product.variants[0].stock" rules="required" :disable="isSetStock" />
                  </div>
                  <div class="col-3 text-center">
                    <div class="label-input">Notifikasi</div>
                    <q-checkbox
                      style="margin-left: -6px; font-size: 10px; line-height: 12px;"
                      class="label-input circle text-grey-7"
                      v-model="product.variants[0].isAlert"
                      size="xs"
                    />
                  </div>
                  <div class="col-4">
                    <base-money-input name="Notifikasi Dalam" v-model="product.variants[0].alertIn" :disable="isSetStock" />
                  </div>
                </div>
              </div>

              <!-- 1 Recipe -->
              <div class="col-12" v-if="product.variants.length == 1 && product.hasRecipe">
                <div class="label-input q-mb-sm">Resep</div>
                <div class="q-mb-xs" v-for="(recipeDetail, index) in product.variants[0].recipeDetails" :key="index">
                  <div class="row q-mb-xs item-text" @click="selectRecipeDetail({ recipeDetail })">
                    <div>{{ recipeDetail.ingredient.name }}</div>
                    <q-space></q-space>
                    <div class="q-mr-xs">{{ recipeDetail.qty }}</div>
                    <div>{{ recipeDetail.ingredient.unit.name }}</div>
                  </div>
                  <q-separator />
                </div>
                <div class="col-12 q-my-sm add-label text-primary text-weight-bold cursor-pointer" @click="selectRecipeDetail({})">
                  <q-icon name="add" size="14px" />
                  <span>Tambah Bahan</span>
                </div>
              </div>

              <!-- Inventory > 2 -->
              <div class="col-12" v-if="product.variants.length > 1 && !product.hasRecipe">
                <div class="label-input q-mb-sm">Variasi</div>
                <div class="q-mb-xs" v-for="(productVariant, index) in product.variants" :key="index">
                  <div class="row q-mb-xs item-text" @click="editProductVariant(productVariant)">
                    <div style="width: 40%">{{ productVariant.name }}</div>
                    <div v-if="product.hasStock" style="width: 20%" class="text-right q-mr-xs">{{ productVariant.stock | numeric }} Unit</div>
                    <q-space />
                    <div style="width: 25%" class="text-right q-mr-xs">{{ productVariant.price | numeric }}</div>
                  </div>
                  <q-separator />
                </div>
              </div>

              <!-- Recipe > 2 -->
              <div class="col-12" v-if="product.variants.length > 1 && product.hasRecipe">
                <div class="label-input q-mb-sm">Variasi</div>
                <div class="q-mb-xs" v-for="(productVariant, index) in product.variants" :key="index">
                  <div class="row q-mb-xs item-text" @click="editProductVariant(productVariant)">
                    <div>{{ productVariant.name }}</div>
                    <q-space />
                    <div class="q-mr-xs">{{ productVariant.price | numeric }}</div>
                  </div>
                  <q-separator />
                </div>
              </div>

              <div class="col-12 add-label text-primary text-weight-bold cursor-pointer" @click="addProductVariant">
                <q-icon name="add" size="14px" />
                <span>Tambah Variasi</span>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="update" />
          </q-card-section>
        </base-form>
      </q-tab-panel>

      <q-tab-panel name="add-product" style="padding: 0px; height: 200px;">
        <create-product-variant-form
          :product="product"
          :item="selectedProductVariant"
          :isSetStock="isSetStock"
          @back="backFromProductVariant"
          @save="saveProductVariant"
          @destroy="destroyProductVariant"
          @selectRecipeDetail="selectRecipeDetail"
        />
      </q-tab-panel>

      <q-tab-panel name="add-recipe-detail" style="padding: 0px; height: 200px;">
        <add-recipe-detail-form
          :item="selectedRecipeDetail"
          :ingredients="ingredients"
          @back="backFromIngredient"
          @save="saveIngredient"
          @destroy="destroyIngredient"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-dialog>
</template>

<script>
import productMixin from './product.mixin';
import modalFormMixin from 'src/mixins/modal-form.mixin';
import CreateProductVariantForm from './CreateProductVariantForm';
import AddRecipeDetailForm from './AddRecipeDetailForm';
import { cloneDeep } from 'lodash';

export default {
  name: 'EditProductDialog',
  props: { productSelected: Object },
  components: { CreateProductVariantForm, AddRecipeDetailForm },
  mixins: [modalFormMixin, productMixin],

  watch: {
    value: function(val) {
      if (!val) return;
      this.setProduct();
    },
  },

  methods: {
    setProduct() {
      this.panel = 'product';
      this.isSetStock = false;
      this.isSetRecipe = false;
      this.hasIngredient = false;
      this.product = cloneDeep(this.productSelected);
      this.extras = this.$store.state.extra.extras.map(extra => {
        const isSelected = this.productSelected.extras.find(productExtra => productExtra.id == extra.id) ? true : false;
        return { ...extra, isSelected };
      });
      if (this.product.hasStock) this.isSetStock = true;
      if (this.product.hasRecipe) this.isSetRecipe = true;
    },
    async update() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;

      this.run(async () => {
        this.product.extraIds = this.extras.filter(extra => extra.isSelected).map(extra => extra.id);
        await this.$store.dispatch('product/update', this);
        this.$q.notify({ type: 'success', caption: 'Produk berhasil di ubah' });
        this.dialog = false;
      });
    },
    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('product/destroy', this);
        this.$q.notify({ type: 'success', caption: 'Produk berhasil di hapus' });
        this.dialog = false;
      });
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
