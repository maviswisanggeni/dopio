<template>
  <q-dialog maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="width: 300px">
        <base-form ref="form" :onSubmit="update">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Ubah Posisi Pengguna</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <q-btn dense flat icon="close" class="text-negative" size="10px" @click="destroy" />
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <base-text-input v-model="user.name" name="Nama" rules="required" disabled />
              </div>
              <div class="col-12">
                <base-select-input v-model="user.roleId" name="Posisi" :options="roles" :disable="user.roleId == 1" />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="update" />
          </q-card-section>
        </base-form>
      </q-card>
    </div>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';
import BaseSelectInput from 'src/components/Form/BaseSelectInput.vue';

export default {
  components: { BaseSelectInput },
  name: 'EditUserDialog',
  mixins: [modalFormMixin],
  props: {
    value: { type: Boolean, default: false },
    userSelected: { type: Object }
  },
  data() {
    return {
      user: {},
      roles: []
    };
  },
  watch: {
    value: function(val) {
      if (!val) return;
      this.userSelected.roleId = this.userSelected.role.id;
      this.user = { ...this.userSelected };
      this.roles = this.$store.state.role.roles.map(role => {
        return { label: role.name, value: role.id, disable: role.id == 1 };
      });
    }
  },
  methods: {
    async update() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        await this.$store.dispatch('user/update', this);
        this.$q.notify({ type: 'success', caption: 'Karyawan berhasil diubah' });
        this.dialog = false;
      });
    },

    async destroy() {
      this.confirmDeleteDialog(async () => {
        await this.$store.dispatch('user/kick', this);
        this.$q.notify({ type: 'success', caption: 'Pengguna berhasil dikick' });
        this.dialog = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
