export default {
  props: {
    value: { type: Boolean, default: false }
  },
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
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
    async confirmDeleteDialog(fn) {
      this.$q
        .dialog({
          title: 'Konfirmasi Hapus ',
          message: 'Apakah anda yakin ingin menghapus data ini ?',
          cancel: true,
          focus: null,
          cancel: { label: 'Batal', flat: true, textColor: 'grey-8' },
          ok: { label: 'Ya', flat: true, textColor: 'negative' }
        })
        .onOk(async () => {
          await fn();
        });
    }
  }
};
