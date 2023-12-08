<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Promo</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getPromos()"></q-btn>
    </portal>

    <div class="row q-pt-md q-col-gutter-md">
      <div v-for="promo in promos" :key="promo.id">
        <q-card class="promo-card cursor-pointer" @click="openEditDialog(promo)">
          <div class="row">
            <div class="col-3 row items-center justify-center" :class="getClassPromoCard(promo.type)">
              <div v-if="promo.type === 'DISCOUNT_PERCENT'" style="font-size: 36px; font-weight: bold;" class="text-negative">%</div>
              <div v-else style="font-size: 28px; font-weight: bold" class="text-blue">IDR</div>
            </div>
            <div class="col-9" style="padding: 4px 4px 4px 8px;">
              <div class="label-input">Nama Promo</div>
              <q-item-label class="q-mb-sm">{{ promo.name }}</q-item-label>
              <div class="label-input">Nilai Potongan</div>
              <q-item-label>
                <span>{{ promo.discountValue | numeric }}</span>
                <span>{{ promo.type == 'DISCOUNT_PERCENT' ? '%' : '' }}</span>
              </q-item-label>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-promo-dialog v-model="isCreatePromoDialogOpen" />
    <edit-promo-dialog v-model="isEditPromoDialogOpen" :promoSelected="promo" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import CreatePromoDialog from './CreatePromoDialog';
import EditPromoDialog from './EditPromoDialog';

export default {
  name: 'PromoPage',
  components: { CreatePromoDialog, EditPromoDialog },
  data() {
    return {
      isCreatePromoDialogOpen: false,
      isEditPromoDialogOpen: false,
      promo: {},
    };
  },
  computed: {
    ...mapState('promo', {
      promos: state => state.promos,
      isLoading: state => state.isLoading,
    }),
  },
  mounted() {
    this.getPromos();
  },
  methods: {
    getClassPromoCard(type) {
      return type == 'DISCOUNT_PERCENT' ? 'percent-discount' : 'fixed-discount';
    },
    async getPromos() {
      await this.$store.dispatch('promo/get', this);
    },
    openCreateDialog() {
      this.isCreatePromoDialogOpen = true;
    },
    async openEditDialog(promo) {
      this.promo = promo;
      this.promo = await this.$store.dispatch('promo/show', this);
      this.isEditPromoDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.percent-discount {
  border-right: 1px dashed $negative;
}
.fixed-discount {
  border-right: 1px dashed $blue;
}
.promo-card {
  height: 85px;
  width: 300px;
  padding: 0px;
}
</style>
