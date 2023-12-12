<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Kas</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getCashes()"></q-btn>
    </portal>

    <div class="row q-gutter-sm justify-center items-end q-mb-sm">
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.startDate" name="Tanggal Mulai" />
      </div>
      <div class="col-xs-12" style="width: 150px;">
        <base-date-input v-model.lazy="filter.endDate" name="Tanggal Selesai" />
      </div>
      <div class="col-xs-12 col-sm-4 col-md-2">
        <base-select-input v-model="filter.type" name="tipe" :options="cashTypes" />
      </div>
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3">
        <q-input class="app-input" outlined dense debounce="300" color="blue" bg-color="white" v-model="filter.search">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-table
      :dense="$q.screen.lt.xs"
      :data="cashes"
      :columns="columns"
      @request="getCashes"
      :pagination.sync="pagination"
      :filter="filter"
      :rows-per-page-options="[25, 50, 100]"
      :loading="isLoading"
      class="app-sticky-table"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" style="top: 50px;" size="28px" />
      </template>
      <template v-slot:body="props">
        <q-tr @click="openEditDialog(props.row)" style="cursor:pointer" :props="props">
          <q-td key="code" :props="props"> {{ props.row.code }}</q-td>
          <q-td key="tanggal" :props="props">{{ props.row.createdAt | isoDateToLocale }}</q-td>
          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td key="cashType" :props="props">
            <q-chip v-if="props.row.type == 'CASH_IN'" color="green" class="text-white cash-badge">MASUK</q-chip>
            <q-chip v-else color="red" class="text-white cash-badge">KELUAR</q-chip>
          </q-td>
          <q-td key="amount" class="text-right" :props="props">
            <span v-if="props.row.amount == 0">{{ props.row.amount | numeric }} </span>
            <span v-else-if="props.row.type == 'CASH_IN'" class="text-positive"> + {{ props.row.amount | numeric }} </span>
            <span v-else class="text-negative"> - {{ props.row.amount | numeric }} </span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-cash-dialog v-model="isCreateDialogOpen" />
    <edit-cash-dialog v-model="isEditDialogOpen" :cashSelected="cashSelected" />
  </q-page>
</template>

<script>
import CreateCashDialog from './CreateCashDialog';
import EditCashDialog from './EditCashDialog';
import { mapState } from 'vuex';

export default {
  name: 'CashPage',
  components: { CreateCashDialog, EditCashDialog },

  data() {
    return {
      filter: { type: null, search: '' },
      columns: [
        { name: 'code', label: 'Kode Kas', field: 'code', align: 'left', headerStyle: 'width: 100px;' },
        { name: 'tanggal', label: 'Tanggal', field: 'createdAt', align: 'left', headerStyle: 'width: 100px;' },
        { name: 'description', label: 'Deskripsi', field: 'description', align: 'left' },
        { name: 'cashType', label: 'Jenis Kas', field: 'cashType', align: 'center', headerStyle: 'width: 100px;' },
        { name: 'amount', label: 'Jumlah (IDR)', field: 'amount', align: 'right', headerStyle: 'width: 100px;' },
      ],
      pagination: { page: 1, rowsPerPage: 25, rowsNumber: 25 },
      cashTypes: [
        { value: null, label: 'Semua' },
        { value: 'CASH_IN', label: 'Kas Masuk' },
        { value: 'CASH_OUT', label: 'Kas Keluar' },
      ],
      cashSelected: null,
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
    };
  },

  watch: {
    'filter.startDate'(value) {
      if (value && !this.filter.endDate) {
        this.filter.endDate = value;
        return;
      }
      this.getCashes();
    },
    'filter.endDate'() {
      if (!this.filter.startDate && this.filter.endDate) return;
      this.getCashes();
    },
  },

  computed: {
    ...mapState('cash', {
      cashes: state => state.cashes,
      isLoading: state => state.isLoading,
    }),
  },

  mounted() {
    this.getCashes();
  },

  methods: {
    async getCashes(props) {
      if (props) this.pagination = props.pagination;
      const { meta } = await this.$store.dispatch('cash/get', this);
      this.pagination.rowsNumber = meta.totalItems;
      this.pagination.rowsPerPage = meta.itemsPerPage;
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(cash) {
      const payload = { $axios: this.$axios, idCash: cash.id };
      this.cashSelected = await this.$store.dispatch('cash/show', payload);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.cash-badge {
  font-size: 10.5px;
  padding: 8px 8px;
}
</style>
