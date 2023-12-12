<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-card style="width: 420px">
      <div class="row items-center justify-center q-pa-xs">
        <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
        <q-separator vertical class="q-mx-xs" />
        <q-space />
        <div class="form-title text-grey-8">Mutasi Stok</div>
        <q-space />
        <q-separator vertical class="q-mx-xs" />
        <div style="width: 18px;"></div>
      </div>
      <q-separator />

      <q-card-section class="scroll" style="height: calc(100vh - 110px);">
        <div class="row q-col-gutter-y-md">
          <div class="col-12">
            <div class="label-input">Tanggal</div>
            <div class="label-text">{{ adjustment.createdAt | dateTime }}</div>
          </div>
          <div class="col-12">
            <div class="label-input">Catatan</div>
            <div class="label-text">{{ adjustment.note ? adjustment.note : '-' }}</div>
          </div>
          <div class="col-12">
            <q-markup-table id="adjustment-table" dense>
              <thead class="table-header bg-blue text-white">
                <tr>
                  <th class="text-left" style="width: 50%">Item</th>
                  <th class="text-center">Satuan</th>
                  <th class="text-center">Stok Awal</th>
                  <th class="text-center">Stok Akhir</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="adjustmentDetail in adjustment.adjustmentDetails" :key="adjustmentDetail.id">
                  <td class="text-left">{{ adjustmentDetail.name }}</td>
                  <td class="text-center">{{ adjustmentDetail.unitName }}</td>
                  <td class="text-center">{{ adjustmentDetail.beginningStock }}</td>
                  <td class="text-center text-weight-bold">
                    <span class="q-mr-xs">{{ adjustmentDetail.endStock }}</span>
                    <span v-if="adjustmentDetail.adjustmentQty >= 0" class="text-positive">
                      <q-icon name="arrow_drop_up" size="16px"></q-icon>
                      <span style="font-size: 12px">{{ adjustmentDetail.adjustmentQty }}</span>
                    </span>
                    <span v-else class="text-negative" style="font-size: 12px">
                      <q-icon name="arrow_drop_down" size="16px"></q-icon>
                      <span style="font-size: 12px">{{ Math.abs(adjustmentDetail.adjustmentQty) | numeric }}</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';

export default {
  name: 'ViewAdjustmentDialog',
  props: { adjustmentSelected: Object },
  mixins: [modalFormMixin],
  data() {
    return {
      adjustment: {},
    };
  },

  watch: {
    value: function(val) {
      if (!val) return;
      this.adjustment = { ...this.adjustmentSelected };
    },
  },
};
</script>

<style lang="scss" scoped>
#adjustment-table th {
  height: 32px;
  font-size: 13px;
  font-weight: 300;
  padding: 8px 12px;
}

#adjustment-table td {
  padding: 8px 12px;
}
</style>
