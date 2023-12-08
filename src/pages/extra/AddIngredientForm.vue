<template>
  <base-form ref="form">
    <div class="row items-center justify-center q-pa-xs">
      <q-btn dense flat icon="arrow_back" class="text-grey" size="10px" @click="$emit('back')" />
      <q-separator vertical class="q-mx-xs" />
      <q-space />
      <div class="form-title text-grey-8">Tambah Bahan</div>
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
            option-label="name"
            v-model="extraIngredient.ingredientId"
            name="Nama Bahan"
            rules="required"
            :options="ingredients"
            @input="onItemChange"
            filter
          />
        </div>
        <div class="col-4">
          <base-money-input name="Qty" v-model="extraIngredient.qty" rules="minValue:1" />
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
    ingredients: { type: Array },
  },
  data() {
    return {
      extraIngredient: {},
    };
  },
  created() {
    if (this.item) {
      this.extraIngredient = { ...this.item };
      return;
    }
    this.extraIngredient = { ingredientId: null, qty: 1 };
  },
  methods: {
    onItemChange(ingredientId) {
      if (!ingredientId) return;
      const ingredient = this.ingredients.find(ingredient => ingredient.id == ingredientId);
      this.extraIngredient.ingredient = ingredient;
    },
    async save() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;
      this.$emit('save', this.extraIngredient);
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
