<template>
  <q-dialog persistent ref="dialog" v-model="dialog" transition-show="scale" transition-hide="scale">
    <q-card class="">
      <q-card-section class="row items-center text-center q-px-lg q-py-lg">
        <q-avatar class="col-12" size="70px" icon="delete" text-color="negative" />
        <span class="col-12 text-h5 text-negative">Hapus!</span>
        <span class="col-12 text-caption  q-py-md">Data yang dihapus tidak dapat kembali, anda Yakin?</span>
      </q-card-section>

      <q-card-actions class="q-px-lg" align="right">
        <q-btn flat no-caps label="Tidak, Batal" color="primary" :loading="loadingCancel" @click="executeCancel" />
        <q-btn no-caps label="Ya, Hapus" color="negative" :loading="loadingOk" @click="executeOk" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DialogConfirm',
  props: {
    message: { type: String, default: '' },
    value: { type: Boolean, default: false },
    onOk: { type: Function, default: () => 1 },
    onCancel: { type: Function, default: () => 1 },
  },
  data() {
    return {
      loadingCancel: false,
      loadingOk: false,
    };
  },
  computed: {
    dialog: {
      get(value) {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    async executeOk() {
      try {
        this.loadingOk = true;
        await this.onOk();
        this.$refs.dialog.hide();
      } finally {
        this.loadingOk = false;
      }
    },
    async executeCancel() {
      try {
        this.loadingCancel = true;
        await this.onCancel();
        this.$refs.dialog.hide();
      } finally {
        this.loadingCancel = false;
      }
    },
    hide() {
      this.$refs.dialog.hide();
    },
  },
};
</script>

<style></style>
