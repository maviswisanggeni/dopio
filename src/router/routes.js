const routes = [
  { path: '/login', meta: { auth: false }, component: () => import('pages/auth/Login') },
  {
    path: '/',
    meta: { auth: true },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // Dashboard
      { path: '', component: () => import('pages/dashboard/DashboardPage') },

      // Katalog
      { path: 'product', component: () => import('pages/product/ProductPage') },
      { path: 'packet', component: () => import('pages/packet/PacketPage') },
      { path: 'extra', component: () => import('pages/extra/ExtraPage') },
      { path: 'category', component: () => import('pages/category/CategoryPage') },
      { path: 'ingredient', component: () => import('pages/ingredient/IngredientPage') },
      { path: 'unit', component: () => import('pages/unit/UnitPage') },

      // Persediaan
      { path: 'inventory', component: () => import('pages/inventory/InventoryPage') },
      { path: 'supplier', component: () => import('pages/supplier/SupplierPage') },
      { path: 'purchase', component: () => import('pages/purchase/PurchasePage') },
      { path: 'adjustment', component: () => import('pages/Adjustment/AdjustmentPage') },

      // Promo
      { path: 'promo', component: () => import('pages/promo/PromoPage') },

      // Penjualan
      { path: 'sale', component: () => import('pages/sale/SalePage') },

      // Kas
      { path: 'cash', component: () => import('pages/cash/CashPage') },

      // Manajemen Meja
      { path: 'table-management', component: () => import('pages/table-management/TableManagementPage') },

      // Laporan
      { path: 'report/summary', component: () => import('pages/report/SummaryReport') },
      { path: 'report/sale-by-category', component: () => import('pages/report/SaleByCategoryReport') },
      { path: 'report/sale-by-item', component: () => import('src/pages/report/SaleByItemReport.vue') },

      // Metode Pembayaran
      { path: 'payment', component: () => import('pages/payment/PaymentPage') },

      // Pengaturan
      { path: 'user', component: () => import('pages/user/UserPage') },
      { path: 'role', component: () => import('pages/role/RolePage') },
      { path: 'setting/user', component: () => import('pages/setting/UserProfilePage') },
      { path: 'setting/company', component: () => import('pages/setting/CompanyProfilePage') },
    ],
  },
  { path: '*', component: () => import('pages/Error404.vue') },
];

export default routes;
