<template>
  <q-drawer
    show-if-above
    v-model="isDrawerOpen"
    side="left"
    content-class="sidebar-background"
    :width="230"
    :breakpoint="620"
    style="overflow-x: hidden;"
  >
    <q-scroll-area class="fit" :thumb-style="thumbStyle" :content-style="contentStyle">
      <div class="row justify-center q-pt-md q-pb-md">
        <img src="~/assets/logo-white-100x100.png" height="64px" alt="Logo" />
      </div>
      <essential-link v-for="link in links" :key="link.title" v-bind="link" />
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import EssentialLink from 'components/home/EssentialLink';

export default {
  name: 'Sidebar',
  components: { EssentialLink },
  props: { value: { type: Boolean, default: false } },
  computed: {
    isDrawerOpen: {
      get(value) {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  data() {
    return {
      links: [],
      avaiableLinks: [
        { title: 'Dashboard', icon: 'insights', to: '/' },
        {
          title: 'Katalog',
          icon: 'dashboard',
          children: [
            { title: 'Produk', to: '/product' },
            { title: 'Kategori Produk', to: '/category' },
            { title: 'Ekstra', to: '/extra' },
            { title: 'Paket', to: '/packet' },
            { title: 'Bahan', to: '/ingredient' },
            { title: 'Satuan', to: '/unit' },
          ],
        },
        {
          title: 'Persediaan',
          icon: 'ic-inventory',
          children: [
            { title: 'Semua', to: '/inventory' },
            { title: 'Pemasok', to: '/supplier' },
            { title: 'Pembelian', to: '/purchase' },
            { title: 'Mutasi Stok', to: '/adjustment' },
          ],
        },
        { title: 'Penjualan', icon: 'mdi-receipt', to: '/sale' },
        { title: 'Promo', icon: 'ic-promo', to: '/promo' },
        { title: 'Kas', icon: 'point_of_sale', to: '/cash' },
        { title: 'Manajemen Meja', icon: 'ic-dine-table', to: '/table-management' },
        { title: 'Metode Pembayaran', icon: 'ic-payment', to: '/payment' },
        {
          title: 'Laporan',
          icon: 'assignment',
          children: [
            { title: 'Ringkasan', to: '/report/summary' },
            { title: 'Penjualan Item', to: '/report/sale-by-item' },
            { title: 'Penjualan Kategori', to: '/report/sale-by-category' },
          ],
        },
        {
          title: 'Pengaturan',
          icon: 'settings',
          children: [
            { title: 'Pengguna', to: '/user' },
            { title: 'Posisi & Hak Akses', to: '/role' },
            { title: 'Perusahaan', to: '/setting/company' },
          ],
        },
      ],
      contentStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        color: '#555',
      },
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#8391a2',
        width: '5px',
        opacity: 1,
      },
    };
  },
  created() {
    const permissions = this.$store.getters['auth/permissions'];
    const canAccessReport = permissions.includes('REPORT');
    const canAccessAuth = permissions.includes('AUTH');
    this.links.push(...this.avaiableLinks.slice(0, 8));
    if (canAccessReport) this.links.push(this.avaiableLinks[8]);
    if (canAccessAuth) this.links.push(this.avaiableLinks[9]);
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout', this);
    },
  },
};
</script>

<style lang="scss">
.sidebar-background {
  background-color: $dark_alt;
  color: white;
}
</style>
