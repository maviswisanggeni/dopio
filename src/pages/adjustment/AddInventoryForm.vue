<template>
  <base-form ref="form">
    <div class="row items-center justify-center q-pa-xs">
      <q-btn dense flat icon="arrow_back" class="text-grey" size="10px" @click="$emit('back')" />
      <q-separator vertical class="q-mx-xs" />
      <q-space />
      <div class="form-title text-grey-8">Tambah Item</div>
      <q-space />
      <q-separator vertical class="q-mx-xs" />
      <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
    </div>
    <q-separator />
    <q-card-section class="scroll" style="height: calc(100vh - 110px);">
      <div class="row q-col-gutter-md">
        <div class="col-9">
          <base-select-input
            v-model="detailAdjustment.inventoryId"
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
            <div class="label-text q-mt-xs">{{ detailAdjustment.unitName }}</div>
          </div>
        </div>
        <div class="col-6">
          <base-money-input name="Stok Awal" v-model="detailAdjustment.beginningStock" disabled />
        </div>
        <div class="col-6">
          <base-money-input name="Stok Akhir" v-model="detailAdjustment.endStock" />
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
    inventories: { type: Array },
  },
  data() {
    return {
      detailAdjustment: {},
    };
  },
  created() {
    if (this.item) {
      this.detailAdjustment = { ...this.item };
      return;
    }
    this.detailAdjustment = { itemType: null, inventoryId: null, stock: 0, endStock: 0 };
  },
  methods: {
    onItemChange(inventoryId) {
      if (!inventoryId) return;
      const inventory = this.inventories.find(inventory => inventory.value == inventoryId);
      this.detailAdjustment.name = inventory.label;
      this.detailAdjustment.itemType = inventory.type;
      this.detailAdjustment.beginningStock = inventory.stock;
      this.detailAdjustment.endStock = inventory.stock;
      this.detailAdjustment.unitName = inventory.unitName;
      if (inventory.type == 'PRODUCT') this.detailAdjustment.productVariantId = +inventory.value.substring(1);
      if (inventory.type == 'INGREDIENT') this.detailAdjustment.ingredientId = +inventory.value.substring(1);
    },
    async save() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;

      this.detailAdjustment.adjustmentQty = this.detailAdjustment.endStock - this.detailAdjustment.beginningStock;
      this.$emit('save', this.detailAdjustment);
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
