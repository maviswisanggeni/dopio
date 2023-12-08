<template>
  <q-dialog full-height maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="width: 420px">
        <base-form ref="form">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Penjualan</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll" v-if="Object.keys(sale).length != 0">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <div class="label-input">Nomor Order</div>
                <div class="label-text">{{ sale.orderNo }}</div>
              </div>
              <div class="col-12">
                <div class="label-input">Tanggal</div>
                <div class="label-text">{{ sale.createdAt | isoDateToLocale }}</div>
              </div>
              <div class="col-12">
                <div class="label-input">Kasir</div>
                <div class="label-text">{{ sale.cashier.name }}</div>
              </div>
              <div class="col-12">
                <q-markup-table id="sale-table" dense>
                  <thead class="table-header bg-blue text-white">
                    <tr>
                      <th class="text-left" style="width: 50%">Item</th>
                      <th class="text-right">Harga</th>
                      <th class="text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="cursor-pointer" v-for="saleDetail in sale.saleDetails" :key="saleDetail.id">
                      <td class="text-left">{{ saleDetail.name }}</td>
                      <td class="text-right">{{ saleDetail.price | numeric }}</td>
                      <td class="text-right">{{ saleDetail.qty | numeric }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>

              <div class="col-12">
                <div class="row justify-end items-center q-mb-sm">
                  <div class="q-mr-sm">Pajak</div>
                  <base-money-input :value="sale.tax" readonly />
                </div>
                <div class="row justify-end items-center q-mb-sm">
                  <div class="q-mr-sm">Diskon</div>
                  <base-money-input :value="sale.discount" readonly />
                </div>
                <div class="row justify-end items-center q-mb-sm">
                  <div class="q-mr-sm">Grand Total</div>
                  <base-money-input :value="sale.grandTotal" readonly />
                </div>
              </div>
            </div>
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
    saleSelected: { type: Object },
  },
  data() {
    return {
      sale: {},
    };
  },
  watch: {
    value(val) {
      if (!val) return;
      this.sale = { ...this.saleSelected };
    },
  },
  methods: {
    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('sale/destroy', this);
        this.$q.notify({ type: 'success', caption: 'Satuan berhasil dihapus' });
        this.dialog = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#sale-table {
  margin-bottom: 0px;

  & th {
    height: 32px;
    font-size: 13px;
    font-weight: 300;
    padding: 8px 12px;
  }

  & td {
    padding: 8px 12px;
  }
}
</style>
