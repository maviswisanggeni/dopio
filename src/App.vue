<template>
  <div id="q-app">
    <router-view v-if="init" />
  </div>
</template>

<script>
const { version } = require('./../package.json');

export default {
  name: 'App',
  data() {
    return {
      init: false,
    };
  },

  async created() {
    console.log(`App Version - ${version}`);
    this.setupIcon();
    this.setupAxios();
    this.refreshToken();
    this.init = true;
  },

  methods: {
    setupIcon() {
      this.$q.iconMapFn = iconName => {
        if (iconName.startsWith('ic-') === true) {
          return { cls: iconName };
        }
      };
    },
    setupAxios() {
      this.$axios.interceptors.response.use(
        response => response,
        error => {
          if (!error.response) {
            const message = 'Masalah Koneksi';
            const caption = 'Koneksi tidak terhubung antara server, Silakan coba kembali beberapa saat';
            this.$q.notify({ type: 'error', message, caption });
            return Promise.reject(error);
          }

          if (error.response.status === 400 || error.response.status === 413) {
            const message = error.response.data.message;
            const caption = error.response.data.validationErrors ? Object.values(error.response.data.validationErrors)[0] : '';
            this.$q.notify({ type: 'error', message, caption });
            return Promise.reject(error);
          }

          if (error.response.status === 404) {
            this.$q.notify({ type: 'error', caption: 'Data tidak ditemukan.' });
            return Promise.reject(error);
          }

          if (error.response.status === 401 && this.$route.path != '/login') {
            this.$store.commit('auth/clear', this);
            this.$router.push('/login');
            return Promise.reject(error);
          }

          if (error.response.status === 403 || error.response.status === 401) {
            return Promise.reject(error);
          }

          const message = 'Oops...';
          const caption = 'Something went wrong.';
          this.$q.notify({ type: 'error', message, caption });
          return Promise.reject(error);
        },
      );
    },
    async refreshToken() {
      const token = this.$q.localStorage.getItem('token');
      if (!token) return this.$router.push('/login');
      this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await this.$store.dispatch('auth/refresh', this);
      await this.$store.dispatch('auth/me', this);
    },
  },
};
</script>
