<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-card style="width: 350px">
      <base-form ref="form" :onSubmit="create">
        <div class="row items-center justify-center q-pa-xs">
          <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
          <q-separator vertical class="q-mx-xs" />
          <q-space />
          <div class="form-title text-grey-8">Tambah Meja</div>
          <q-space />
          <q-separator vertical class="q-mx-xs" />
          <div style="width: 18px;"></div>
        </div>
        <q-separator />

        <q-card-section class="scroll" style="height: calc(100vh - 110px);">
          <div class="row q-col-gutter-y-md">
            <div class="col-12">
              <base-money-input v-model="dineTableGenerate.amount" name="Tambah Jumlah Meja" rules="required" :maxlength="3" />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <new-save-btn :isLoading="isLoading" @click="create" />
        </q-card-section>
      </base-form>
    </q-card>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';

export default {
  name: 'CreateTableDialog',
  mixins: [modalFormMixin],
  data() {
    return {
      dineTableGenerate: {}
    };
  },

  watch: {
    value: function(val) {
      if (val == true) this.setTable();
    }
  },

  methods: {
    setTable() {
      this.dineTableGenerate = { amount: 1 };
    },
    async create() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;

      this.run(async () => {
        await this.$store.dispatch('dineTable/create', this);
        this.$q.notify({ type: 'success', caption: 'Meja berhasil di tambah' });
        this.dialog = false;
      });
    }
  }
};
</script>
