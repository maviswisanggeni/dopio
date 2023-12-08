export default {
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    async run(fn) {
      this.isLoading = true;
      try {
        await fn();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async runLoading(fn) {
      this.$q.loading.show();
      try {
        await fn();
      } catch (error) {
        console.error(error);
      } finally {
        this.$q.loading.hide();
      }
    },
  },
};
