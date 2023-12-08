<template>
  <q-dialog full-height maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="height:100vh; width: 350px">
        <base-form ref="form" :onSubmit="create">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Ubah Posisi & Hak Akses</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <div style="width: 18px;"></div>
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <base-text-input v-model="role.name" name="Nama Posisi" rules="required" />
              </div>
              <div class="col-12">
                <div class="label-input q-mb-xs">Pilih Hak Akses</div>
                <div class="row q-gutter-y-sm">
                  <div class="col-12" v-for="permission in role.permissions" :key="permission.value">
                    <q-checkbox
                      color="positive"
                      size="sm"
                      class="label-input circle text-bold"
                      v-model="permission.isSelected"
                      :label="permission.label"
                      dense
                    />
                    <div class="label-input q-ml-lg" style="font-size: 11px;">{{ permission.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn :isLoading="isLoading" @click="create" />
          </q-card-section>
        </base-form>
      </q-card>
    </div>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';

export default {
  name: 'CreateRoleDialog',
  mixins: [modalFormMixin],
  props: {
    value: { type: Boolean, default: false },
  },
  data() {
    return {
      role: {},
    };
  },
  watch: {
    value(val) {
      if (!val) return;
      this.role = { name: '', permissions: [] };
      this.role.permissions = this.$store.state.role.permissions.map(permission => {
        return { ...permission, isSelected: false };
      });
    },
  },
  methods: {
    async create() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        await this.$store.dispatch('role/create', this);
        this.$q.notify({ type: 'success', caption: 'Posisi berhasil ditambah' });
        this.dialog = false;
      });
    },
  },
};
</script>

<style lang="scss"></style>
