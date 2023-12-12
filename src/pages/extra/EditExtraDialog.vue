<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-tab-panels style="width: 350px; overflow: hidden;" v-model="panel" animated>
      <q-tab-panel name="extra" style="padding:0px;">
        <base-form ref="form" :onSubmit="update">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Ubah Extra</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
          </div>
          <q-separator />

          <q-card-section class="scroll" style="height: calc(100vh - 110px);">
            <div class="row q-col-gutter-md">
              <div class="row items-center full-width">
                <div class="q-mt-sm" style="width: 120px">
                  <image-crop-upload size="95px" v-model="extra.image" :name="extra.name" />
                </div>
                <div class="row col">
                  <div class="col-12 q-mb-sm">
                    <base-text-input name="Nama Ekstra" v-model="extra.name" rules="required" />
                  </div>
                  <div class="col-12">
                    <base-money-input name="Harga" v-model="extra.price" rules="required" />
                  </div>
                </div>
              </div>
              <div class="col-12" v-if="extra.extraIngredients.length >= 1">
                <div class="text-weight-bold q-mb-sm">Bahan</div>
                <div class="q-mb-xs" v-for="(extraIngredient, index) in extra.extraIngredients" :key="index">
                  <div class="row q-mb-xs ingredient-text" @click="editIngredient(extraIngredient)">
                    <div>{{ extraIngredient.ingredient.name }}</div>
                    <q-space></q-space>
                    <div class="q-mr-xs">{{ extraIngredient.qty }}</div>
                    <div>{{ extraIngredient.ingredient.unit.name }}</div>
                  </div>
                  <q-separator />
                </div>
              </div>

              <div class="add-label text-primary text-weight-bold cursor-pointer" @click="addIngredient">
                <q-icon name="add" size="14px" />
                <span>Tambah Bahan</span>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="update" />
          </q-card-section>
        </base-form>
      </q-tab-panel>

      <q-tab-panel name="add-ingredient" style="padding: 0px; height: 200px;">
        <add-ingredient-form
          :item="selectedExtraIngredient"
          :ingredients="ingredients"
          @back="back"
          @save="saveIngredient"
          @destroy="destroyIngredient"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';
import addIngredientForm from './addIngredientForm';
import { cloneDeep } from 'lodash';

export default {
  name: 'EditExtraDialog',
  props: { extraSelected: Object },
  components: { addIngredientForm },
  mixins: [modalFormMixin],
  data() {
    return {
      panel: 'extra',
      extra: { extraIngredients: [] },
      AllIngredients: [],
      ingredients: [],
      filter: '',
      selectedExtraIngredient: {},
    };
  },

  computed: {
    productsFiltered() {
      const filter = this.filter.toLowerCase();
      return this.products.filter(product => product.name.toLowerCase().includes(filter));
    },
  },

  watch: {
    value: function(val) {
      if (!val) return;
      this.setExtra();
    },
  },

  created() {
    this.allIngredients = this.$store.state.ingredient.ingredients;
  },

  methods: {
    setExtra() {
      this.panel = 'extra';
      this.extra = cloneDeep(this.extraSelected);
      this.filter = '';
    },
    setIngredients(props = {}) {
      const exceptIds = this.extra.extraIngredients.map(ei => ei.ingredientId);
      if (exceptIds.length == 0) {
        this.ingredients = this.allIngredients;
        return;
      }
      if (props.includeId) {
        const index = exceptIds.indexOf(props.includeId);
        exceptIds.splice(index, 1);
      }
      this.ingredients = this.allIngredients.filter(ingredient => !exceptIds.includes(ingredient.id));
    },
    addIngredient() {
      this.setIngredients();
      this.selectedExtraIngredient = null;
      this.panel = 'add-ingredient';
    },
    editIngredient(extraIngredient) {
      this.setIngredients({ includeId: extraIngredient.ingredientId });
      this.selectedExtraIngredient = extraIngredient;
      this.panel = 'add-ingredient';
    },
    back() {
      this.panel = 'extra';
    },
    saveIngredient(extraIngredient) {
      const index = this.extra.extraIngredients.findIndex(ei => ei.id == extraIngredient.id);
      if (index < 0) return this.extra.extraIngredients.push(extraIngredient);
      this.extra.extraIngredients[index] = extraIngredient;
    },
    destroyIngredient() {
      const index = this.extra.extraIngredients.findIndex(ei => ei.ingredientId == this.selectedExtraIngredient.ingredientId);
      this.extra.extraIngredients.splice(index, 1);
    },
    async update() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;

      this.run(async () => {
        await this.$store.dispatch('extra/update', this);
        this.$q.notify({ type: 'success', caption: 'Extra berhasil di ubah' });
        this.dialog = false;
      });
    },
    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('extra/destroy', this);
        this.$q.notify({ type: 'success', caption: 'Extra berhasil di hapus' });
        this.dialog = false;
      });
    },
  },
};
</script>

<style lang="scss">
.add-label {
  font-size: 11px;
}

.ingredient-text {
  font-weight: 300;
  font-size: 12px;
  padding: 0px 2px;
  cursor: pointer;
}
</style>
