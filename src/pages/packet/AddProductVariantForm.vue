<template>
  <base-form ref="form">
    <div class="row items-center justify-center q-pa-xs">
      <q-btn dense flat icon="arrow_back" class="text-grey" size="10px" @click="$emit('back')" />
      <q-separator vertical class="q-mx-xs" />
      <q-space />
      <div class="form-title text-grey-8">Tambah Produk</div>
      <q-space />
      <q-separator vertical class="q-mx-xs" />
      <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
    </div>
    <q-separator />
    <q-card-section class="scroll" style="height: calc(100vh - 110px);">
      <div class="row q-col-gutter-md">
        <div class="col-8">
          <base-select-input
            option-value="id"
            option-label="fullName"
            v-model="packetDetail.productVariantId"
            name="Nama Produk"
            rules="required"
            :options="productVariants"
            @input="onItemChange"
            filter
          />
        </div>
        <div class="col-4">
          <base-money-input name="Qty" v-model="packetDetail.qty" rules="minValue:1" />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <new-save-btn @click="save" />
    </q-card-section>
  </base-form>
</template>

<script>
export default {
  name: 'AddItemForm',
  props: {
    item: { type: Object },
    productVariants: { type: Array },
  },
  data() {
    return {
      packetDetail: {},
    };
  },
  created() {
    if (this.item) {
      this.packetDetail = { ...this.item };
      return;
    }
    this.packetDetail = { productVariantId: null, qty: 1 };
  },
  methods: {
    onItemChange(productVariantId) {
      if (!productVariantId) return;
      const productVariant = this.productVariants.find(productVariant => productVariant.id == productVariantId);
      this.packetDetail.productVariant = productVariant;
    },
    async save() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;
      this.$emit('save', this.packetDetail);
      setTimeout(() => this.$emit('back'), 1);
    },
    async destroy() {
      this.$emit('destroy');
      this.$emit('back');
    },
  },
};
</script>

<style></style>
