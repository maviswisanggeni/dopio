<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Pengguna</span>
    </portal>

    <div class="column  q-gutter-sm" style="width: 320px;">
      <div class="text-subtitle q-mt-lg">Profil</div>
      <q-separator></q-separator>
      <base-text-input name="Nama" v-model="user.name" />
      <base-text-input name="Telepon" v-model="user.phone" readonly />
      <base-text-input name="Email" v-model="user.email" />
      <q-btn style="width: 80px;" class="q-mt-md" label="Simpan" size="12px" padding="4px 8px" color="primary" no-caps @click="updateUser()" />

      <div class="text-subtitle q-mt-lg">Ganti Password</div>
      <q-separator></q-separator>
      <base-text-password name="Password Lama" v-model="oldPassword" />
      <base-text-password name="Password Baru" v-model="newPassword" />
      <base-text-password name="Konfirmasi Password Baru" v-model="confirmNewPassword" />
      <q-btn
        style="width: 140px;"
        class="q-mt-md"
        label="Ganti Password"
        size="12px"
        padding="4px 8px"
        color="primary"
        no-caps
        @click="onSubmitPassword()"
      ></q-btn>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'UserProfilePage',
  data() {
    return {
      init: false,
      user: {},
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };
  },
  mounted() {
    this.getProfile();
  },

  methods: {
    async getProfile() {
      await this.$store.dispatch('auth/me', this);
      this.user = { ...this.$store.state.auth.user };
    },
    async updateUser() {
      await this.$store.dispatch('auth/updateUser', this);
      this.user = { ...this.$store.state.auth.user };
      this.$q.notify({ type: 'success', message: 'Profil berhasil diubah' });
    },
    validateConfirmPassword() {
      if (!this.oldPassword) return 'Password lama tidak boleh kosong';
      if (!this.newPassword) return 'Password baru tidak boleh kosong';
      if (this.newPassword.length < 6) return 'Password baru minimal 6 karakter';
      if (this.newPassword != this.confirmNewPassword) return 'Konfirmasi Password tidak cocok';
    },
    async onSubmitPassword() {
      const error = this.validateConfirmPassword();
      if (error) return this.$q.notify({ type: 'error', message: error });

      this.$q
        .dialog({
          title: 'Konfirmasi Ubah Password',
          message: 'Apakah anda yakin password sudah sesuai ?',
          cancel: true,
          focus: null,
          ok: { flat: true, textColor: 'negative', color: 'negative' },
        })
        .onOk(this.changePassword);
    },
    async changePassword() {
      await this.$store.dispatch('auth/changePassword', this);
      this.$q.notify({ type: 'success', message: 'Password berhasil diubah' });
      this.clearPasswordForm();
    },
    clearPasswordForm() {
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.text-subtitle {
  font-size: 16px;
  font-weight: 600;
}
</style>
