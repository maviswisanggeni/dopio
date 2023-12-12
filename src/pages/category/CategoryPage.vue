<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Kategori Produk</span>
      <q-btn round dense size="12px" flat icon="cached" @click="getCategories()"></q-btn>
    </portal>

    <div class="row q-gutter-y-sm justify-center items-center q-mb-sm">
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2"></div>
      <q-space></q-space>
      <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
        <q-input class="app-input" outlined dense debounce="150" color="blue" bg-color="white" v-model="filter">
          <template v-slot:prepend>
            <q-icon size="20px" name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div v-for="category in categoriesFiltered" :key="category.id">
        <q-chip color="blue" text-color="white" class="category-chip" clickable @click="openEditDialog(category)">
          {{ category.name }}
        </q-chip>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[8, 16]">
      <q-btn round size="11px" padding="10px" icon="add" color="primary" @click="openCreateDialog" />
    </q-page-sticky>

    <create-category-dialog v-model="isCreateDialogOpen" />
    <edit-category-dialog v-model="isEditDialogOpen" :categorySelected="category" />
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import CreateCategoryDialog from './CreateCategoryDialog';
import EditCategoryDialog from './EditCategoryDialog';

export default {
  name: 'CategoryPage',
  components: { CreateCategoryDialog, EditCategoryDialog },
  data() {
    return {
      columns: [{ name: 'name', label: 'Nama Kategori', field: 'name', align: 'left' }],
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      category: {},
      filter: null,
    };
  },
  computed: {
    ...mapState('category', {
      categories: state => state.categories,
      isLoading: state => state.isLoading,
    }),
    categoriesFiltered() {
      if (!this.filter) return this.categories;
      const filter = this.filter.toLowerCase();
      return this.categories.filter(category => category.name.toLowerCase().includes(filter));
    },
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      await this.$store.dispatch('category/get', this);
    },
    openCreateDialog() {
      this.isCreateDialogOpen = true;
    },
    async openEditDialog(category) {
      this.category = category;
      this.category = await this.$store.dispatch('category/show', this);
      this.isEditDialogOpen = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.category-chip {
  padding: 4px 24px;
  font-size: 14px;
  font-family: Proxima-Nova-alt;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
