<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
      <q-tab-panels style="width: 420px; overflow: hidden;" v-model="panel" animated>
        <q-tab-panel name="purchase" style="padding:0px;">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Pembelian</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <div style="width: 18px;"></div>
          </div>
          <q-separator />

          <q-card-section class="scroll" style="height: calc(100vh - 110px);">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <div class="label-input">Tanggal</div>
                <div class="label-text">{{ purchase.createdAt | dateTime }}</div>
              </div>
              <div class="col-12">
                <base-select-input name="Pemasok" v-model="purchase.supplierId" option-value="id" option-label="name" :options="suppliers" filter />
              </div>
              <div class="col-12">
                <base-text-area name="Catatan" v-model="purchase.note" rows="2" />
              </div>
              <div class="col-12">
                <q-markup-table id="purchase-table" dense>
                  <thead class="bg-blue text-white">
                    <tr>
                      <td class="text-left" style="width: 50%">Item</td>
                      <td class="text-right">Harga</td>
                      <td class="text-right">Qty</td>
                      <td class="text-right">Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      class="cursor-pointer"
                      v-for="purchaseDetail in purchase.purchaseDetails"
                      :key="purchaseDetail.id"
                      @click="editPurchaseDetail(purchaseDetail)"
                    >
                      <td class="text-left">{{ purchaseDetail.name }}</td>
                      <td class="text-right">{{ purchaseDetail.price | numeric }}</td>
                      <td class="text-right">{{ purchaseDetail.qty | numeric }}</td>
                      <td class="text-right">{{ purchaseDetail.total | numeric }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
              <div class="add-label text-primary text-weight-bold cursor-pointer" @click="addPurchaseDetail()">
                <q-icon name="add" size="14px" />
                <span>Tambah Item</span>
              </div>
              <div class="col-12">
                <div class="row justify-end items-center q-mb-sm">
                  <div class="q-mr-sm">Pajak</div>
                  <base-money-input v-model="purchase.tax" />
                </div>
                <div class="row justify-end items-center q-mb-sm">
                  <div class="q-mr-sm">Diskon</div>
                  <base-money-input v-model="purchase.discount" />
                </div>
                <div class="row justify-end items-center q-mb-sm">
                  <div class="q-mr-sm">Grand Total</div>
                  <base-money-input :value="grandTotal" readonly />
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="create" />
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name="add-purchase-detail" style="padding: 0px; height: 200px;">
          <add-inventory-form
            :item="selectedPurchaseDetail"
            :inventories="inventories"
            @back="back"
            @save="savePurchaseDetail"
            @destroy="destroyPurchaseDetail"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-dialog>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';
import AddInventoryForm from './AddInventoryForm';

export default {
  name: 'CreatePurchaseDialog',
  mixins: [modalFormMixin],
  components: { AddInventoryForm },

  data() {
    return {
      purchase: { purchaseDetails: [] },
      panel: 'purchase',
      selectedPurchaseDetail: {},
      allInventories: [],
      inventories: [],
      suppliers: [],
    };
  },

  watch: {
    value(val) {
      if (!val) return;
      this.panel = 'purchase';
      this.purchase = { createdAt: new Date(), note: null, purchaseDetails: [] };
    },
  },

  computed: {
    grandTotal() {
      const total = this.purchase.purchaseDetails.reduce((sum, purchaseDetail) => sum + purchaseDetail.qty * purchaseDetail.price, 0);
      return total + this.purchase.tax - this.purchase.discount;
    },
  },

  created() {
    this.suppliers = [...this.$store.state.supplier.suppliers];
    this.suppliers.unshift({ id: null, name: '' });
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
      const exceptIds = this.purchase.purchaseDetails.map(purchaseDetail => purchaseDetail.inventoryId);
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
    addPurchaseDetail() {
      this.getInventories();
      this.selectedPurchaseDetail = { id: 'T' + Date.now() };
      this.panel = 'add-purchase-detail';
    },
    editPurchaseDetail(purchaseDetail) {
      this.getInventories({ includeId: purchaseDetail.inventoryId });
      this.selectedPurchaseDetail = purchaseDetail;
      this.panel = 'add-purchase-detail';
    },
    back() {
      this.panel = 'purchase';
    },
    savePurchaseDetail(purchaseDetail) {
      const index = this.purchase.purchaseDetails.findIndex(pd => pd.id == purchaseDetail.id);
      if (index < 0) return this.purchase.purchaseDetails.push(purchaseDetail);
      this.purchase.purchaseDetails[index] = purchaseDetail;
    },
    destroyPurchaseDetail() {
      const index = this.purchase.purchaseDetails.findIndex(ei => ei.purchaseId == this.selectedPurchaseDetail.purchaseId);
      this.purchase.purchaseDetails.splice(index, 1);
    },
    async create() {
      if (this.purchase.purchaseDetails.length == 0) {
        return this.$q.notify({ type: 'error', caption: 'Item tidak boleh kosong' });
      }

      this.run(async () => {
        await this.$store.dispatch('purchase/create', this);
        this.$q.notify({ type: 'success', caption: 'Pembelian berhasil di tambah' });
        this.dialog = false;
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
