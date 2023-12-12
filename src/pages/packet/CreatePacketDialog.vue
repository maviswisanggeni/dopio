<template>
  <q-dialog maximized v-model="dialog" :persistent="isLoading" position="right">
    <q-tab-panels style="width: 350px; overflow: hidden;" v-model="panel" animated>
      <q-tab-panel name="packet" style="padding: 0px;">
        <base-form ref="form" :onSubmit="create">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Tambah Paket</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <div style="width: 18px;"></div>
          </div>
          <q-separator />

          <q-card-section class="scroll" style="height: calc(100vh - 110px);">
            <div class="row q-col-gutter-md">
              <div class="row items-center full-width">
                <div class="q-mt-sm" style="width: 120px">
                  <image-crop-upload size="95px" v-model="packet.image" :name="packet.name" />
                </div>
                <div class="row col">
                  <div class="col-12 q-mb-sm">
                    <base-text-input name="Nama Paket" v-model="packet.name" rules="required" />
                  </div>
                  <div class="col-12">
                    <base-money-input name="Harga" v-model="packet.price" rules="required" />
                  </div>
                </div>
              </div>
              <div class="col-12">
                <base-text-area name="Deskripsi" v-model="packet.description" rows="2" />
              </div>
              <div class="col-12" v-if="packet.packetDetails.length >= 1">
                <div class="text-weight-bold q-mb-sm">Produk</div>
                <div class="q-mb-xs" v-for="(packetDetail, index) in packet.packetDetails" :key="index">
                  <div class="row q-mb-xs ingredient-text" @click="editProductVariant(packetDetail)">
                    <div>{{ packetDetail.productVariant.fullName }}</div>
                    <q-space></q-space>
                    <div class="q-mr-xs">{{ packetDetail.qty }}</div>
                    <div>Unit</div>
                  </div>
                  <q-separator />
                </div>
              </div>

              <div class="add-label text-primary text-weight-bold cursor-pointer" @click="addProductVariant">
                <q-icon name="add" size="14px" />
                <span>Tambah Produk</span>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="create" />
          </q-card-section>
        </base-form>
      </q-tab-panel>

      <q-tab-panel name="add-packet" style="padding: 0px; height: 200px;">
        <add-product-variant-form
          :item="selectedProductVariant"
          :productVariants="productVariants"
          @back="back"
          @save="saveProductVariant"
          @destroy="destroyProductVariant"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';
import addProductVariantForm from './AddProductVariantForm';

export default {
  name: 'CreatePacketDialog',
  props: {},
  components: { addProductVariantForm },
  mixins: [modalFormMixin],
  data() {
    return {
      panel: 'packet',
      packet: { packetDetails: [] },
      allProductVariant: [],
      productVariants: [],
      filter: '',
      selectedProductVariant: {},
    };
  },

  computed: {},

  watch: {
    value: function(val) {
      if (!val) return;
      this.setPacket();
    },
  },

  created() {
    this.allProductVariant = this.$store.state.product.productVariants;
  },

  methods: {
    setPacket() {
      this.panel = 'packet';
      this.filter = '';
    },
    setProductVariants(props = {}) {
      const exceptIds = this.packet.packetDetails.map(ei => ei.packetId);
      if (exceptIds.length == 0) {
        this.productVariants = this.allProductVariant;
        return;
      }
      if (props.includeId) {
        const index = exceptIds.indexOf(props.includeId);
        exceptIds.splice(index, 1);
      }
      this.productVariants = this.allProductVariant.filter(ingredient => !exceptIds.includes(ingredient.id));
    },
    addProductVariant() {
      this.setProductVariants();
      this.selectedProductVariant = null;
      this.panel = 'add-packet';
    },
    editProductVariant(packetProductVariant) {
      this.setProductVariants({ includeId: packetProductVariant.packetId });
      this.selectedProductVariant = packetProductVariant;
      this.panel = 'add-packet';
    },
    back() {
      this.panel = 'packet';
    },
    saveProductVariant(packetDetail) {
      const index = this.packet.packetDetails.findIndex(pd => pd.id == packetDetail.id);
      if (index < 0) return this.packet.packetDetails.push(packetDetail);
      this.packet.packetDetails[index] = packetDetail;
    },
    destroyProductVariant() {
      const index = this.packet.packetDetails.findIndex(pd => pd.id == this.selectedProductVariant.id);
      this.packet.packetDetails.splice(index, 1);
    },
    async create() {
      const validate = await this.$refs.form.validate();
      if (!validate) return;
      if (this.packet.packetDetails.length <= 0) return this.$q.notify({ type: 'error', message: 'Minimal Produk harus 1 ' });

      this.run(async () => {
        await this.$store.dispatch('packet/create', this);
        this.$q.notify({ type: 'success', caption: 'Paket berhasil di ubah' });
        this.dialog = false;
      });
    },
  },
};
</script>

<style lang="scss">
.add-label {
  font-size: 11px;
}

.ingredient-text {
  font-weight: 300;
  font-size: 12px;
  padding: 0px 2px;
  cursor: pointer;
}
</style>
