<template>
  <q-page class="main-page q-ml-xs">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Metode Pembayaran</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getPayments()"></q-btn>
    </portal>

    <div class="q-mb-lg" v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
      <div class="payment-method-title">{{ paymentMethod.name }}</div>
      <div class="row q-gutter-md">
        <q-card
          class="payment-card cursor-pointer"
          :class="{ 'payment-card-disable': !payment.isActive }"
          v-for="payment in paymentMethod.payments"
          :key="payment.id"
          @click="openEditDialog(payment)"
        >
          <q-card-section class="q-pa-sm">
            <div class="payment-name">{{ payment.name }}</div>
          </q-card-section>
          <div class="absolute-bottom-right">
            <q-toggle size="28px" :value="payment.isActive" @input="val => tooglePaymentActive(payment, val)" />
          </div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-payment-dialog v-model="isCreateDialogOpen" />
    <edit-payment-dialog v-model="isEditDialogOpen" :paymentSelected="payment" />
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import CreatePaymentDialog from './CreatePaymentDialog';
import EditPaymentDialog from './EditPaymentDialog';

export default {
  name: 'PaymentPage',
  components: { CreatePaymentDialog, EditPaymentDialog },
  data() {
    return {
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      payment: {},
    };
  },

  computed: {
    ...mapState('payment', {
      payments: state => state.payments,
      paymentMethods: state => state.paymentMethods,
      isLoading: state => state.isLoading,
    }),
    ...mapGetters('payment', ['paymentMethods']),
  },

  mounted() {
    this.getPayments();
  },

  methods: {
    async getPayments() {
      await this.$store.dispatch('payment/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(payment) {
      if (payment.id == 100) return this.$q.notify({ type: 'error', message: 'Pembayaran Tunai tidak bisa di ubah' });
      this.payment = payment;
      this.payment = await this.$store.dispatch('payment/show', this);
      this.isEditDialogOpen = true;
    },
    async tooglePaymentActive(payment, value) {
      if (payment.id == 100) return this.$q.notify({ type: 'error', message: 'Pembayaran Tunai tidak bisa di ubah' });
      try {
        const payload = { payment, $axios: this.$axios, isActive: value };
        await this.$store.dispatch('payment/toogleActive', payload);
      } catch (error) {
        this.$store.commit('payment/updatePayment', payment);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.payment-method-title {
  font-size: 16px;
  font-weight: 300;
  margin-left: 2px;
  margin-bottom: 4px;
}

.payment-name {
  font-family: Proxima-Nova-Alt;
  font-weight: bold;
}
.payment-card {
  width: 140px;
  height: 70px;
  border-radius: 8px;

  &-disable {
    color: $grey-6;
  }
}
</style>
