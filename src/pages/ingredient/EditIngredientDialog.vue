<template>
  <q-dialog full-height maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="width: 300px">
        <base-form ref="form" :onSubmit="update">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Ubah Bahan</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <base-text-input v-model="ingredient.name" name="Nama Bahan" rules="required" />
              </div>
              <div class="col-12">
                <base-select-input v-model="ingredient.unitId" name="Satuan" rules="required" :options="unitOptions" filter />
              </div>
              <div class="col-12" v-if="!isSetStock">
                <div class="row justify-between">
                  <div class="label-input">Kontrol Stok</div>
                  <q-toggle size="32px" v-model="ingredient.hasStock" dense @input="onHasStockChanged" />
                </div>
                <q-separator class="q-mt-xs" />
              </div>
              <template v-if="ingredient.hasStock">
                <div class="col-12">
                  <base-money-input name="Jumlah Stok" v-model="ingredient.stock" rules="required" :disable="isSetStock" />
                </div>
                <div class="col-12">
                  <div class="row justify-between">
                    <div class="label-input">Notifikasi</div>
                    <q-toggle size="32px" v-model="ingredient.isAlert" dense />
                  </div>
                  <q-separator class="q-mt-xs" />
                </div>
                <div class="col-12" v-if="ingredient.isAlert">
                  <base-money-input name="Notifikasi Dalam (stok)" v-model="ingredient.alertIn" />
                </div>
              </template>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="update" />
          </q-card-section>
        </base-form>
      </q-card>
    </div>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';
import { mapGetters } from 'vuex';

export default {
  name: 'EditIngredientDialog',
  mixins: [modalFormMixin],
  props: {
    value: { type: Boolean, default: false },
    ingredientSelected: { type: Object },
  },
  data() {
    return {
      ingredient: {},
      isSetStock: false,
    };
  },
  computed: {
    ...mapGetters('unit', ['unitOptions']),
  },
  watch: {
    value(val) {
      if (!val) return;
      this.isSetStock = false;
      this.ingredient = { ...this.ingredientSelected, hasStock: this.ingredientSelected.stock == null ? false : true };
      if (this.ingredient.hasStock) this.isSetStock = true;
    },
  },
  methods: {
    onHasStockChanged(val) {
      if (val == true) return;
      this.ingredient.stock = null;
      this.ingredient.alertIn = null;
      this.ingredient.isAlert = false;
    },
    async update() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        await this.$store.dispatch('ingredient/update', this);
        this.$q.notify({ type: 'success', caption: 'Bahan berhasil ditambah' });
        this.dialog = false;
      });
    },

    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('ingredient/destroy', this);
        this.$q.notify({ type: 'success', caption: 'Bahan berhasil dihapus' });
        this.dialog = false;
      });
    },
  },
};
</script>
