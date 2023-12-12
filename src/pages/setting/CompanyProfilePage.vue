<template>
  <q-page class="main-page">
    <portal to="action-bar">
      <span class="text-title q-mr-xs">Perusahaan</span>
    </portal>

    <div class="row q-col-gutter-x-xl">
      <div class="col-md-4 col-xs-12 column q-gutter-sm">
        <div class="text-subtitle q-mt-lg">Profile</div>
        <q-separator />
        <div class="row q-mb-sm">
          <div style="width: 100px; margin-right: 16px;">
            <div style="height: 8px;"></div>
            <image-crop-upload size="100px" v-model="company.logo" />
          </div>
          <div class="col">
            <base-text-input name="Nama" v-model="company.name" />
            <div style="height: 8px;"></div>
            <base-text-input name="Telepon" v-model="company.phone" />
          </div>
        </div>
        <base-text-input name="Email" v-model="company.email" />
        <base-text-input name="Alamat" v-model="company.address" />
        <base-text-input name="Kota" v-model="company.city" />
        <base-text-input name="Hotspot Url" v-model="company.hotspotUrl" />
        <base-text-input name="Hotspot Username " v-model="company.hotspotUsername" />
        <base-text-input name="Hotspot Password" v-model="company.hotspotPassword" />
      </div>

      <div class="col-md-4 col-xs-12 column q-gutter-sm">
        <div class="text-subtitle q-mt-lg">Sistem</div>
        <q-separator />
        <div class="row justify-between items-start">
          <div class="col-11 toogle-label">Print</div>
          <q-toggle size="32px" v-model="company.isPrintReceiptAtSave" color="primary" dense />
          <div class="label-input">Print otomatis setelah menyimpan penjualan</div>
        </div>
        <div class="row justify-between items-start">
          <div class="col-11 toogle-label">Pajak</div>
          <q-toggle size="32px" v-model="company.isTaxEnabled" color="primary" @input="onTaxEnabled" dense />
          <div class="label-input">Menambahkan pajak 10% ke dalam penjualan</div>
        </div>
        <div class="row justify-between items-start">
          <div class="col-11 toogle-label">Harga termasuk pajak</div>
          <q-toggle size="32px" v-model="company.isIncludeTaxEnabled" color="primary" @input="onIncludeTaxEnabled" dense />
          <div class="label-input">Harga produk sudah termasuk pajak</div>
        </div>
        <div class="row justify-between items-start">
          <div class="col-11 toogle-label">Limit Stok</div>
          <q-toggle size="32px" v-model="company.isStockLimitEnabled" dense />
          <div class="label-input">Dapat melakukan penjualan walaupun stok minus</div>
        </div>
        <div class="row justify-between items-start">
          <div class="col-11 toogle-label">Menajamen Meja</div>
          <q-toggle size="32px" v-model="company.isTableManagementEnabled" dense />
          <div class="label-input">Penjualan dilengkapi dengan pemilihan meja</div>
        </div>
      </div>

      <div class="col-md-4 col-xs-12 column q-gutter-sm">
        <div class="text-subtitle q-mt-lg">Struk</div>
        <q-separator />
        <base-text-input name="Password Wifi" v-model="company.passwordWifi" />
        <base-text-input name="Catatan Struk" v-model="company.noteReceipt" />
        <base-text-input name="Website" v-model="company.websiteUrl" />
        <base-text-input name="Instagram" v-model="company.instagramUrl" />
        <base-text-input name="Facebook" v-model="company.facebookUrl" />
        <base-text-input name="Twitter" v-model="company.twitterUrl" />
      </div>
    </div>
    <q-btn style="width: 80px;" class="q-mt-md" label="Simpan" size="12px" padding="4px 8px" color="primary" no-caps @click="updateCompany()" />
  </q-page>
</template>

<script>
export default {
  name: 'CompanyProfilePage',
  data() {
    return {
      company: {},
    };
  },

  created() {
    this.company = { ...this.$store.state.auth.company };
  },

  methods: {
    async updateCompany() {
      await this.$store.dispatch('auth/updateLogo', this);
      await this.$store.dispatch('auth/updateCompany', this);
      this.$q.notify({ type: 'success', message: 'Data perusahaan berhasil diubah' });
    },
    onTaxEnabled() {
      if (!this.company.isTaxEnabled && !this.company.isIncludeTaxEnabled) return;
      this.company.isTaxEnabled = true;
      this.company.isIncludeTaxEnabled = false;
    },
    onIncludeTaxEnabled() {
      if (!this.company.isTaxEnabled && !this.company.isIncludeTaxEnabled) return;
      this.company.isTaxEnabled = false;
      this.company.isIncludeTaxEnabled = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.text-subtitle {
  font-size: 16px;
  font-weight: 600;
}
.toogle-label {
  font-size: 16px;
  font-weight: 400;
}
</style>
