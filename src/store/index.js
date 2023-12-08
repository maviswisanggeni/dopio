import Vue from 'vue';
import Vuex from 'vuex';

import AuthModule from './auth-module';
import ProductModule from './product-module';
import cashModule from './cash-module';
import IngredientModule from './ingredient-module';
import ProdukModule from './produk-module';
import VariantModule from './variant-module';
import extraModule from './extra-module';
import promoModule from './promo-module';
import supplierModule from './supplier-module';
import dineTableModule from './dine-table-module';
import paymentModule from './payment-module';
import userModule from './user-module';
import roleModule from './role-module';
import adjustmentModule from './adjustment-module';
import unitModule from './unit-module';
import categoryModule from './category-module';
import packetModule from './packet-module';
import purchaseModule from './purchase-module';
import SaleModule from './sale-module';

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth: AuthModule,
      product: ProductModule,
      produk: ProdukModule,
      variant: VariantModule,

      packet: packetModule,
      extra: extraModule,
      category: categoryModule,
      ingredient: IngredientModule,
      unit: unitModule,

      supplier: supplierModule,
      purchase: purchaseModule,
      adjustment: adjustmentModule,

      sale: SaleModule,

      promo: promoModule,
      cash: cashModule,
      dineTable: dineTableModule,
      payment: paymentModule,

      user: userModule,
      role: roleModule,
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}
