<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Mutasi Stok</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getAdjustments()"></q-btn>
    </portal>

    <div class="row q-gutter-sm justify-center items-end q-mb-sm">
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.startDate" name="Tanggal Mulai" />
      </div>
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.endDate" name="Tanggal Selesai" />
      </div>
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input outlined dense class="app-input" debounce="300" color="blue" bg-color="white" v-model="filter.search" @input="getAdjustments">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-scroll-area
      style="height: calc(100vh - 200px); width: 100%"
      :thumb-style="{ right: '-2px', borderRadius: '100px', backgroundColor: '#b7c0c9', width: '4px', opacity: 0.6 }"
    >
      <div v-for="(adjustmentByDate, index) in adjustmentsByDate" :key="index">
        <table class="adjustment-table">
          <tr>
            <th class="text-left table-date-header" style="min-width: 110px; width: 10%">{{ adjustmentByDate.createdAt | isoDateToLocale }}</th>
            <th class="text-left table-header" style="width: 35%">Items</th>
            <th class="text-center table-header" style="min-width: 50px; width: 5%">Mutasi</th>
            <th class="text-left table-header" style="width: 45%">Catatan</th>
          </tr>
          <tr class="table-row" v-for="adjustment in adjustmentByDate.adjustments" :key="adjustment.id" @click="openEditDialog(adjustment)">
            <td class="table-cell" :class="getCardClass(adjustment.totalAdjustmentQty)">{{ adjustment.createdAt | time }}</td>
            <td class="table-cell">{{ adjustment.items }}</td>
            <td v-if="adjustment.totalAdjustmentQty > 0" class="text-center table-cell text-positive">
              <q-icon name="arrow_drop_up" size="16px"></q-icon>
              <span>{{ adjustment.totalAdjustmentQty | numeric }}</span>
            </td>
            <td v-else-if="adjustment.totalAdjustmentQty == 0" class="text-center table-cell">{{ adjustment.totalAdjustmentQty }}</td>
            <td v-else class="text-center table-cell text-negative">
              <q-icon name="arrow_drop_down" size="16px"></q-icon>
              <span>{{ Math.abs(adjustment.totalAdjustmentQty) | numeric }}</span>
            </td>
            <td class="table-cell">{{ adjustment.note }}</td>
          </tr>
        </table>
      </div>
    </q-scroll-area>

    <q-page-sticky position="bottom" :offset="[0, 8]">
      <q-pagination
        size="12px"
        padding="4px"
        v-model="pagination.page"
        :max="pagination.totalPages"
        :direction-links="true"
        @input="getAdjustments"
        input
      />
    </q-page-sticky>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-adjustment-dialog v-model="isCreateDialogOpen" />
    <view-adjustment-dialog v-model="isEditDialogOpen" :adjustmentSelected="adjustment" />
  </q-page>
</template>

<script>
import CreateAdjustmentDialog from './CreateAdjustmentDialog';
import ViewAdjustmentDialog from './ViewAdjustmentDialog';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'AdjustmentPage',
  components: { CreateAdjustmentDialog, ViewAdjustmentDialog },

  data() {
    return {
      filter: { search: '', startDate: null, endDate: null },
      pagination: { page: 1, rowsPerPage: 25, totalPages: 1 },
      adjustment: null,
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      selectedDate: '',
    };
  },

  computed: {
    ...mapState('adjustment', {
      adjustments: state => state.adjustments,
      isLoading: state => state.isLoading,
    }),
    ...mapGetters('adjustment', ['adjustmentsByDate']),
  },

  watch: {
    'filter.startDate'(value) {
      if (value && !this.filter.endDate) {
        this.filter.endDate = value;
        return;
      }
      this.getAdjustments();
    },
    'filter.endDate'() {
      if (!this.filter.startDate && this.filter.endDate) return;
      this.getAdjustments();
    },
  },

  mounted() {
    this.getAdjustments();
  },

  methods: {
    getCardClass(qty) {
      return qty >= 0 ? 'positive' : 'negative';
    },
    async getAdjustments() {
      const { meta } = await this.$store.dispatch('adjustment/get', this);
      this.pagination.page = meta.currentPage;
      this.pagination.rowsPerPage = meta.itemsPerPage;
      this.pagination.totalPages = meta.totalPages;
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(adjustment) {
      this.adjustment = adjustment;
      this.adjustment = await this.$store.dispatch('adjustment/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.adjustment-table {
  width: 100%;
  margin-bottom: 12px;
}

.table-date-header {
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
}

.table-header {
  font-size: 12px;
  font-weight: 300;
  padding: 4px 6px;
  margin: 2px;
}

.table-row {
  background-color: #eeeeee;
  font-size: 12px;
  text-overflow: ellipsis;
  height: 26px;
  cursor: pointer;

  &:hover {
    background-color: #e2e2e2;
  }
}

.table-cell {
  padding: 8px 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  &.positive {
    border-left: $positive 3px solid;
  }

  &.negative {
    border-left: $negative 3px solid;
  }
}
</style>
