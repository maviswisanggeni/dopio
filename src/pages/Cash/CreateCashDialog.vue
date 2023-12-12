<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-card style="width: 350px">
      <base-form ref="form" :onSubmit="create">
        <div class="row items-center justify-center q-pa-xs">
          <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
          <q-separator vertical class="q-mx-xs" />
          <q-space />
          <div class="form-title text-grey-8">Tambah Kas</div>
          <q-space />
          <q-separator vertical class="q-mx-xs" />
          <div style="width: 18px;"></div>
        </div>
        <q-separator />

        <q-card-section class="scroll" style="height: calc(100vh - 110px);">
          <div class="row q-col-gutter-y-md">
            <div class="col-12">
              <div class="label-input">Tanggal</div>
              <div class="">{{ now | isoDateToLocale }}</div>
            </div>
            <div class="col-12">
              <base-select-input name="Jenis Kas" v-model="cash.type" :options="options" rules="required" />
            </div>
            <div class="col-12">
              <base-money-input name="Nominal" v-model="cash.amount" rules="required" />
            </div>
            <div class="col-12">
              <base-text-area name="Deskripsi" v-model="cash.description" rules="required" />
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
  name: 'CashDialog',
  mixins: [modalFormMixin],
  data() {
    return {
      now: new Date(),
      cash: {},
      options: [
        { label: 'Kas Masuk', value: 'CASH_IN' },
        { label: 'Kas Keluar', value: 'CASH_OUT' },
      ],
    };
  },

  watch: {
    value: function(val) {
      if (val == true) this.setCash();
    },
    'cash.amount': 'validateAmount',
  },

  methods: {
    validateAmount() {
      
      if (this.cash.amount > 1000000000) {
        
        this.cash.amount = 0;
      }

      
    },
    setCash() {
      this.cash = { type: null, nominal: 0, description: null };
    },
    async create() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;

      this.run(async () => {
        await this.$store.dispatch('cash/create', this);
        this.$q.notify({ type: 'success', caption: 'Kas berhasil di tambah' });
        this.dialog = false;
        await this.$store.dispatch('cash/refresh', this);
      });
    },
  },
};
</script>
