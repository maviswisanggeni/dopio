<template>
  <base-form ref="form">
    <div class="row items-center justify-center q-pa-xs">
      <q-btn dense flat icon="arrow_back" class="text-grey" size="10px" @click="$emit('back')" />
      <q-separator vertical class="q-mx-xs" />
      <q-space />
      <div class="form-title text-grey-8">Pilih Persediaan</div>
      <q-space />
      <q-separator vertical class="q-mx-xs" />
      <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
    </div>
    <q-separator />
    <q-card-section class="scroll" style="height: calc(100vh - 110px);">
      <div class="row q-col-gutter-md">
        <div class="col-9">
          <base-select-input
            v-model="purchaseDetail.inventoryId"
            name="Nama Item"
            rules="required"
            :options="inventories"
            @input="onItemChange"
            filter
          />
        </div>
        <div class="col-3">
          <div class="column">
            <div class="label-input">Satuan</div>
            <div class="label-text q-mt-xs">{{ purchaseDetail.unitName }}</div>
          </div>
        </div>
        <div class="col-6">
          <base-money-input name="Harga Satuan" v-model="purchaseDetail.price" />
        </div>
        <div class="col-3">
          <base-money-input name="Qty" v-model="purchaseDetail.qty" />
        </div>
        <div class="col-6">
          <base-money-input name="Total" :value="grandTotal" readonly />
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
  name: 'AddInventoryForm',
  props: {
    item: { type: Object },
    inventories: { type: Array },
  },
  data() {
    return {
      purchaseDetail: {},
    };
  },
  computed: {
    grandTotal() {
      return this.purchaseDetail.qty * this.purchaseDetail.price;
    },
  },
  created() {
    if (this.item) {
      this.purchaseDetail = { ...this.item };
      return;
    }
    this.purchaseDetail = { itemType: null, inventoryId: null, stock: 0, endStock: 0 };
  },
  methods: {
    onItemChange(inventoryId) {
      if (!inventoryId) return;
      const inventory = this.inventories.find(inventory => inventory.value == inventoryId);
      this.purchaseDetail.itemType = inventory.type;
      this.purchaseDetail.name = inventory.label;
      this.purchaseDetail.unitName = inventory.unitName;
      if (inventory.type == 'PRODUCT') this.purchaseDetail.productVariantId = +inventory.value.substring(1);
      if (inventory.type == 'INGREDIENT') this.purchaseDetail.ingredientId = +inventory.value.substring(1);
    },
    async save() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;

      this.purchaseDetail.total = this.grandTotal;
      this.$emit('save', this.purchaseDetail);
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
