<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-card style="width: 380px">
      <base-form ref="form" :onSubmit="update">
        <div class="row items-center justify-center q-pa-xs">
          <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
          <q-separator vertical class="q-mx-xs" />
          <q-space />
          <div class="form-title text-grey-8">Ubah Promo</div>
          <q-space />
          <q-separator vertical class="q-mx-xs" />
          <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
        </div>
        <q-separator />

        <q-card-section class="scroll" style="height: calc(100vh - 110px);">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <base-text-input name="Nama Promo" v-model="promo.name" rules="required" />
            </div>
            <div class="col-6">
              <q-radio size="26px" class="label-input q-mb-xs" v-model="promo.type" val="DISCOUNT_PERCENT" label="Menggunakan Persen (%)" dense />
              <base-money-input v-model="promo.discountPercent" :disable="promo.type == 'DISCOUNT_NUMBER'" />
            </div>
            <div class="col-6">
              <q-radio size="26px" class="label-input q-mb-xs" v-model="promo.type" val="DISCOUNT_NUMBER" label="Menggunakan IDR" dense />
              <base-money-input v-model="promo.discountValue" :disable="promo.type == 'DISCOUNT_PERCENT'" />
            </div>

            <div class="col-12">
              <div class="label-input q-mb-xs">Pilih Produk</div>
              <q-input class="app-input" outlined dense debounce="100" v-model="filter" placeholder="Cari...">
                <template v-slot:prepend>
                  <q-icon class="q-mr-xs" size="20px" name="search" />
                </template>
              </q-input>
              <div class="row" style="margin: 8px 0px 4px -4px;">
                <div class="col-6" v-for="productVariant in productVariantsFiltered" :key="productVariant.id">
                  <q-checkbox class="checkbox-input" :label="productVariant.fullName" v-model="productVariant.isSelected" size="xs" />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <new-save-btn :isLoading="isLoading" @click="update" />
        </q-card-section>
      </base-form>
    </q-card>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';

export default {
  name: 'EditPromoDialog',
  props: { promoSelected: Object },
  mixins: [modalFormMixin],
  data() {
    return {
      promo: {},
      productVariants: [],
      filter: '',
    };
  },

  computed: {
    productVariantsFiltered() {
      return this.productVariants.filter(pv => pv.fullName.toLowerCase().includes(this.filter.toLowerCase()));
    },
  },

  watch: {
    value: function(val) {
      if (!val) return;
      this.setPromo();
    },
  },

  methods: {
    setPromo() {
      this.productVariants = this.$store.state.product.productVariants.map(productVariant => {
        const isSelected = this.promoSelected.productVariants.find(pv => pv.id == productVariant.id) ? true : false;
        return { ...productVariant, isSelected };
      });
      this.promo = { ...this.promoSelected };
      if (this.promo.type == 'DISCOUNT_PERCENT') {
        this.promo.discountPercent = this.promoSelected.discountValue;
        this.promo.discountValue = 0;
      }
      this.filter = '';
    },
    async update() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;

      this.run(async () => {
        this.promo.productVariantIds = this.productVariants.filter(pv => pv.isSelected).map(pv => pv.id);
        await this.$store.dispatch('promo/update', this);
        this.$q.notify({ type: 'success', caption: 'Promo berhasil di ubah' });
        this.dialog = false;
      });
    },
    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('promo/destroy', this);
        this.$q.notify({ type: 'success', caption: 'Promo berhasil di hapus' });
        this.dialog = false;
      });
    },
  },
};
</script>

<style lang="scss"></style>
