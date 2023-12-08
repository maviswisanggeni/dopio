<template>
  <q-dialog maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="width: 300px">
        <base-form ref="form" :onSubmit="update">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Ubah Pembayaran</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <base-select-input v-model="payment.methodId" name="Metode Pembayaran" rules="required" :options="options" />
              </div>
              <div class="col-12">
                <base-text-input v-model="payment.name" name="Nama Pembayaran" rules="required" />
              </div>
              <div class="col-12 row">
                <div class="label-input">Pembayaran Aktif</div>
                <q-space></q-space>
                <q-toggle size="32px" v-model="payment.isActive" dense />
                <q-separator class="q-mt-xs" />
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
  name: 'EditPaymentDialog',
  mixins: [modalFormMixin],
  props: {
    value: { type: Boolean, default: false },
    paymentSelected: { type: Object },
  },
  data() {
    return {
      payment: {},
      options: [
        { label: 'E-Wallet', value: 2 },
        { label: 'EDC', value: 3 },
      ],
    };
  },
  watch: {
    value(val) {
      if (!val) return;
      this.payment = { ...this.paymentSelected };
    },
  },
  methods: {
    async update() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        await this.$store.dispatch('payment/update', this);
        this.$q.notify({ type: 'success', caption: 'Pembayaran berhasil diubah' });
        this.dialog = false;
      });
    },
    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('payment/destroy', this);
        this.$q.notify({ type: 'success', caption: 'Pembayaran berhasil dihapus' });
        this.dialog = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
