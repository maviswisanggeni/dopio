<template>
  <q-dialog maximized v-model="dialog" position="right">
    <div class="row">
      <q-card style="width: 300px">
        <base-form ref="form" :onSubmit="create">
          <div class="row items-center justify-center q-pa-xs">
            <q-btn v-close-popup dense flat icon="arrow_back" class="text-grey" size="10px" />
            <q-separator vertical class="q-mx-xs" />
            <q-space />
            <div class="form-title text-grey-8">Tambah Pengguna</div>
            <q-space />
            <q-separator vertical class="q-mx-xs" />
            <div style="width: 18px;"></div>
          </div>
          <q-separator />

          <q-card-section style="height: calc(100vh - 110px);" class="scroll">
            <div class="row q-col-gutter-y-md">
              <div class="col-12">
                <base-text-input
                  v-model="user.phone"
                  name="Nomor Handphone"
                  mask="#### #### #####"
                  rules="required|phoneNumber"
                  hint="di-awali dengan 08"
                  debounce="500"
                  unmasked-value
                />
              </div>
              <div class="col-12">
                <base-text-input v-model="user.name" name="Nama" rules="required" :disable="isUserExist" />
              </div>

              <div class="col-12">
                <base-select-input v-model="user.roleId" name="Posisi" :options="roles" />
              </div>

              <template v-if="!isUserExist">
                <div class="col-12">
                  <div class="label-input required">Password</div>
                  <q-input
                    outlined
                    dense
                    v-model.trim="user.password"
                    :type="visiblePassword ? 'text' : 'password'"
                    :rules="[val => val.length >= 6 || 'Password minimal 6 karakter']"
                    hide-bottom-space
                    no-error-icon
                  >
                    <template v-slot:append>
                      <q-icon
                        class="cursor-pointer"
                        :name="visiblePassword ? 'visibility' : 'visibility_off'"
                        @click="visiblePassword = !visiblePassword"
                      />
                    </template>
                  </q-input>
                </div>

                <div class="col-12">
                  <div class="label-input required">Konfirmasi Password</div>
                  <q-input
                    outlined
                    dense
                    v-model.trim="user.passwordConfirm"
                    :type="visiblePasswordConfirm ? 'text' : 'password'"
                    :rules="[val => val == user.password || 'Password tidak cocok']"
                    hide-bottom-space
                    no-error-icon
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="visiblePasswordConfirm ? 'visibility' : 'visibility_off'"
                        class="cursor-pointer"
                        @click="visiblePasswordConfirm = !visiblePasswordConfirm"
                      />
                    </template>
                  </q-input>
                </div>
              </template>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-md">
            <new-save-btn v-if="!isUserExist" @click="create" />
            <new-save-btn v-else text="Undang" @click="invite" />
          </q-card-section>
        </base-form>
      </q-card>
    </div>
  </q-dialog>
</template>

<script>
import modalFormMixin from 'src/mixins/modal-form.mixin';
import { validate } from 'vee-validate';

export default {
  name: 'CreateUserDialog',
  mixins: [modalFormMixin],
  data() {
    return {
      user: {},
      roles: [],
      visiblePassword: false,
      visiblePasswordConfirm: false,
      isUserExist: false,
    };
  },
  watch: {
    value(val) {
      if (!val) return;
      // this.user = { name: 'Jimmy', phone: '082153681555', password: '123456', passwordConfirm: '123456', roleId: 2 };
      this.user = { name: null, phone: null, password: null, passwordConfirm: null, roleId: null };
      this.roles = this.$store.state.role.roles.map(role => {
        return { label: role.name, value: role.id, disable: role.id == 1 };
      });
    },
    'user.phone'(val) {
      validate(val, 'required|phoneNumber').then(result => {
        if (!result.valid) return;
        this.findUser();
      });
    },
  },
  methods: {
    async create() {
      const validate = await this.$refs.form.validate();
      if (!validate) return false;

      this.run(async () => {
        await this.$store.dispatch('user/create', this);
        this.dialog = false;
        this.$q.notify({ type: 'success', caption: 'Pengguna berhasil ditambah' });
      });
    },
    async findUser() {
      try {
        const user = await this.$store.dispatch('user/findByPhoneNumber', this);
        this.user.name = user.name;
        this.isUserExist = true;
      } catch (error) {
        this.isUserExist = false;
      }
    },
    async invite() {
      this.run(async () => {
        await this.$store.dispatch('user/invite', this);
        this.dialog = false;
        this.$q.notify({ type: 'success', caption: 'Pengguna berhasil diundang' });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
