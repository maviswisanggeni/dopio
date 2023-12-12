<template>
  <q-dialog full-height maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="height:100vh; width: 350px">
        <base-form ref="form" :onSubmit="update">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Ubah Meja</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll">
            <base-text-input v-model="dineTable.label" name="Label (Maks. 3 Karakter)" rules="required" :maxlength="3" />
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
import BaseTextInput from 'src/components/Form/BaseTextInput.vue';

export default {
  components: { BaseTextInput },
  name: 'EditTableDialog',
  mixins: [modalFormMixin],
  props: {
    value: { type: Boolean, default: false },
    dineTableSelected: { type: Object }
  },
  data() {
    return {
      dineTable: {}
    };
  },
  watch: {
    value(val) {
      if (!val) return;
      this.dineTable = { ...this.dineTableSelected };
    }
  },
  methods: {
    async update() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        await this.$store.dispatch('dineTable/update', this);
        this.$q.notify({ type: 'success', caption: 'Meja berhasil diubah' });
        this.dialog = false;
      });
    },

    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('dineTable/destroy', this);
        this.$q.notify({ type: 'success', caption: 'Meja berhasil dihapus' });
        this.dialog = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
