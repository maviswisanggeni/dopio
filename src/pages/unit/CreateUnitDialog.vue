<template>
  <q-dialog full-height maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="width: 300px">
        <base-form ref="form" :onSubmit="create">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Tambah Satuan</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <div style="width: 18px;"></div>
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
      unit: {},
    };
  },
  watch: {
    value(val) {
      if (!val) return;
      this.unit = { name: null };
    },
  },
  methods: {
    async create() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        await this.$store.dispatch('unit/create', this);
        this.$q.notify({ type: 'success', caption: 'Satuan berhasil ditambah' });
        this.dialog = false;
      });
    },
  },
};
</script>
