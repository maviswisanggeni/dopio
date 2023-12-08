<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-tab-panels style="width: 400px; overflow: hidden;" v-model="panel" animated>
      <q-tab-panel name="adjustment" style="padding:0px;">
        <base-form ref="form" :onSubmit="create">
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
                <base-text-area name="Catatan" v-model="adjustment.note" />
              </div>
              <div class="col-12" v-if="adjustment.adjustmentDetails.length >= 1">
                <q-markup-table id="adjustment-table" dense>
                  <thead class="table-header bg-blue text-white">
                    <tr>
                      <th class="text-left" style="width: 50%">Item</th>
                      <th class="text-center">Stok Awal</th>
                      <th colspan="2" class="text-center">Stok Akhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      class="cursor-pointer"
                      v-for="adjustmentDetail in adjustment.adjustmentDetails"
                      :key="adjustmentDetail.id"
                      @click="editItem(adjustmentDetail)"
                    >
                      <td class="text-left">{{ adjustmentDetail.name }}</td>
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

              <div class="add-label text-primary text-weight-bold cursor-pointer" @click="addItem()">
                <q-icon name="add" size="14px" />
                <span>Tambah Item</span>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="create" />
          </q-card-section>
        </base-form>
      </q-tab-panel>

      <q-tab-panel name="add-item" style="padding: 0px; height: 200px;">
        <add-inventory-form
          :item="selectedAdjustmentDetail"
          :inventories="inventories"
          @back="back"
          @save="saveAdjustmentDetail"
          @destroy="destroyAdjustmentDetail"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';
import AddInventoryForm from './AddInventoryForm';

export default {
  name: 'CreateAdjustmentDialog',
  props: { adjustmentSelected: Object },
  mixins: [modalFormMixin],
  components: { AddInventoryForm },

  data() {
    return {
      adjustment: { adjustmentDetails: [] },
      panel: 'adjustment',
      selectedAdjustmentDetail: {},
      allInventories: [],
      inventories: [],
    };
  },

  watch: {
    value(val) {
      if (!val) return;
      this.panel = 'adjustment';
      this.adjustment = { createdAt: new Date(), note: null, adjustmentDetails: [] };
    },
  },

  created() {
    this.getAllInventories();
  },

  methods: {
    getAllInventories() {
      const productVariants = this.$store.state.product.productVariants
        .filter(productVariant => productVariant.stock != null)
        .map(productVariant => {
          return { value: 'P' + productVariant.id, label: productVariant.fullName, type: 'PRODUCT', stock: productVariant.stock, unitName: 'unit' };
        });

      const ingredients = this.$store.state.ingredient.ingredients
        .filter(ingredient => ingredient.stock != null)
        .map(ingredient => {
          return { value: 'I' + ingredient.id, label: ingredient.name, type: 'INGREDIENT', stock: ingredient.stock, unitName: ingredient.unit.name };
        });

      this.allInventories.push(...productVariants, ...ingredients);
    },
    getInventories(props = {}) {
      const exceptIds = this.adjustment.adjustmentDetails.map(ad => ad.inventoryId);
      if (exceptIds.length == 0) {
        this.inventories = this.allInventories;
        return;
      }
      if (props.includeId) {
        const index = exceptIds.indexOf(props.includeId);
        exceptIds.splice(index, 1);
      }
      this.inventories = this.allInventories.filter(inventory => !exceptIds.includes(inventory.value));
    },
    addItem() {
      this.getInventories();
      this.selectedAdjustmentDetail = {};
      this.panel = 'add-item';
    },
    editItem(adjustmentDetail) {
      this.getInventories({ includeId: adjustmentDetail.inventoryId });
      this.selectedAdjustmentDetail = adjustmentDetail;
      this.panel = 'add-item';
    },
    back() {
      this.panel = 'adjustment';
    },
    saveAdjustmentDetail(adjustmentDetail) {
      const index = this.adjustment.adjustmentDetails.findIndex(ad => ad.inventoryId == this.selectedAdjustmentDetail.inventoryId);
      if (index < 0) return this.adjustment.adjustmentDetails.push(adjustmentDetail);
      this.adjustment.adjustmentDetails[index] = adjustmentDetail;
    },
    destroyAdjustmentDetail() {
      const index = this.adjustment.adjustmentDetails.findIndex(ad => ad.inventoryId == this.selectedAdjustmentDetail.inventoryId);
      this.adjustment.adjustmentDetails.splice(index, 1);
    },
    async create() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;

      if (this.adjustment.adjustmentDetails.length == 0) {
        return this.$q.notify({ type: 'error', caption: 'Item tidak boleh kosong' });
      }

      this.run(async () => {
        await this.$store.dispatch('adjustment/create', this);
        this.$q.notify({ type: 'success', caption: 'Mutasi stok berhasil di tambah' });
        this.dialog = false;
        await this.$store.dispatch('adjustment/refresh', this);
      });
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

.add-label {
  font-size: 11px;
}
</style>
