<template>
  <q-layout view="lHh LpR lFf">
    <q-header class="bg-accent text-dark">
      <q-toolbar class="toolbar items-center justify-center">
        <q-toolbar-title>
          <div class="row">
            <q-btn dense flat round class="lt-md text-grey-8" icon="menu" @click="isDrawerOpen = !isDrawerOpen" size="12px" />
            <div style="margin-left: 4px;"></div>
            <portal-target name="action-bar" class="q-xs-md" style="display: inline-block" />
          </div>
        </q-toolbar-title>
        <notification-menu />
        <q-btn size="14px" dense round flat icon="account_circle" class="q-mr-sm" color="grey-8">
          <q-menu>
            <q-list dense style="width: 100px">
              <q-item clickable @click="$router.push('/setting/user')">
                <q-item-section>Profil</q-item-section>
              </q-item>
              <q-item clickable @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <div style="width: 10px;"></div>
      </q-toolbar>
    </q-header>

    <sidebar v-model="isDrawerOpen" />

    <q-page-container>
      <router-view v-if="init" />
      <q-page v-else class="main-page" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';
import Sidebar from 'components/Home/Sidebar';
import NotificationMenu from 'src/components/Home/NotificationMenu';

export default {
  name: 'MainLayout',
  components: { Sidebar, NotificationMenu },
  data() {
    return {
      isDrawerOpen: true,
      init: false,
      socket: null,
    };
  },
  computed: {
    ...mapState({ user: state => state.auth.user }),
  },
  async mounted() {
    await this.$store.dispatch('unit/get', this);
    await this.$store.dispatch('ingredient/get', this);
    await this.$store.dispatch('category/get', this);
    await this.$store.dispatch('extra/get', this);
    await this.$store.dispatch('supplier/get', this);
    await this.$store.dispatch('product/get', this);
    this.setupSocket();
    this.init = true;
  },

  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout', this);
      this.$router.push('/login');
    },
    setupSocket() {
      const token = this.$q.localStorage.getItem('token');
      const transportOptions = {
        polling: {
          extraHeaders: {
            token,
          },
        },
      };
      this.$socket.io.opts.transportOptions = transportOptions;
      this.$socket.io.autoConnect = true;
      this.$socket.connect();
    },
  },

  sockets: {
    connect() {
      if (process.env.PROD) return;
      console.info('socket connected');
    },
    stockIngredientsUpdated(ingredients) {
      this.$store.commit('ingredient/updateStockIngredients', ingredients);
    },
    stockProductVariantsUpdated(productVariants) {
      this.$store.commit('product/updateStockVariants', productVariants);
    },
  },
};
</script>

<style lang="scss">
.toolbar {
  margin: 4px 0px 0px 8px;
}
</style>
