<template>
  <q-dialog full-height maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="width: 300px">
        <base-form ref="form" :onSubmit="update">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Ubah Satuan</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <base-text-input v-model="unit.name" name="Nama Satuan" rules="required" />
              </div>
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

export default {
  name: 'EditUnitDialog',
  mixins: [modalFormMixin],
  props: {
    value: { type: Boolean, default: false },
    unitSelected: { type: Object },
  },
  data() {
    return {
      unit: {},
    };
  },
  watch: {
    value(val) {
      if (!val) return;
      this.unit = { ...this.unitSelected };
    },
  },
  methods: {
    async update() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        await this.$store.dispatch('unit/update', this);
        this.$q.notify({ type: 'success', caption: 'Satuan berhasil ditambah' });
        this.dialog = false;
      });
    },
    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('unit/destroy', this);
        this.$q.notify({ type: 'success', caption: 'Satuan berhasil dihapus' });
        this.dialog = false;
      });
    },
  },
};
</script>
