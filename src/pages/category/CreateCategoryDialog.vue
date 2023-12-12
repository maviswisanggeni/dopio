<template>
  <q-dialog full-height maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="width: 380px">
        <base-form ref="form" :onSubmit="create">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Tambah Kategori</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <div style="width: 18px;"></div>
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <base-text-input v-model="category.name" name="Nama Kategori" rules="required" />
              </div>

              <div class="col-12">
                <div class="label-input q-mb-xs">Pilih Produk</div>
                <q-input class="app-input" outlined dense debounce="100" v-model="filter" placeholder="Cari...">
                  <template v-slot:prepend>
                    <q-icon class="q-mr-xs" size="20px" name="search" />
                  </template>
                </q-input>
                <div class="row" style="margin: 8px 0px 4px -4px;">
                  <div class="col-6" v-for="product in productsFiltered" :key="product.id">
                    <q-checkbox class="checkbox-input" size="xs" :label="product.name" v-model="product.isSelected" />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="create" />
          </q-card-section>
        </base-form>
      </q-card>
    </div>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';

export default {
  name: 'CreateUnitDialog',
  mixins: [modalFormMixin],
  props: {
    value: { type: Boolean, default: false },
  },
  data() {
    return {
      category: {},
      products: [],
      filter: '',
    };
  },
  computed: {
    productsFiltered() {
      const filter = this.filter.toLowerCase();
      return this.products.filter(product => product.name.toLowerCase().includes(filter));
    },
  },
  watch: {
    value(val) {
      if (!val) return;
      this.setCategory();
    },
  },
  methods: {
    setCategory() {
      this.products = this.$store.state.product.products.map(productVariant => {
        return { ...productVariant, isSelected: false };
      });
      this.category = { ...this.categorySelected };
      this.filter = '';
    },
    async create() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        this.category.productIds = this.products.filter(product => product.isSelected).map(product => product.id);
        await this.$store.dispatch('category/create', this);
        this.$q.notify({ type: 'success', caption: 'Satuan berhasil ditambah' });
        this.dialog = false;
      });
    },
  },
};
</script>
