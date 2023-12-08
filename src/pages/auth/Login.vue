<template>
  <q-layout class="login-page">
    <q-page-container>
      <q-page class="row items-center gradient-background">
        <base-form :onSubmit="login">
          <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 q-px-xl q-py-xl">
            <div class="subtitle">Welcome to</div>
            <div class="title q-mb-lg">DOPIO</div>
            <q-input type="text" outlined class="form-input q-mb-md" bg-color="accent" v-model="phoneInput" placeholder="Nomor HP">
              <template v-slot:prepend>
                <img class="q-ml-xs" src="~assets/indonesia-flag.svg" height="18" />
              </template>
            </q-input>
            <q-input type="password" ref="password" v-model="password" outlined class="form-input q-mb-lg" bg-color="accent" placeholder="Password" />
            <q-btn type="submit" class="full-width q-py-sm" color="primary" label="Masuk" @click="login" :loading="isLoading" :disable="isLoading">
              <template v-slot:loading>
                <q-spinner class="q-mr-lg" color="white" size="20px" />
                <span>Masuk</span>
                <div class="q-ml-lg" style="width:20px"></div>
              </template>
            </q-btn>
          </div>
        </base-form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Login',
  data() {
    let phoneInput = '';
    let password = '';

    if (process.env.DEV) {
      // phoneInput = '082153486532';
      // password = '123456';
      phoneInput = '085389186613';
      password = 'kgaia123';
    }

    return {
      phone: null,
      phoneInput,
      password,
      isLoading: false,
    };
  },

  methods: {
    async login() {
      this.setPhoneNumber();
      const error = this.validate();
      if (error) return this.$q.notify({ type: 'error', message: error });

      try {
        this.isLoading = true;
        await this.$store.dispatch('auth/login', this);
        this.$router.push('/');
      } catch (error) {
        this.isLoading = false;
        if (!error.response) return;
        const message = error.response.data.message;
        this.$q.notify({ type: 'error', caption: message });
        if (message == 'Mohon hubungi owner untuk menentukan posisi anda!') return this.$q.notify({ type: 'error', caption: message });
        this.$refs.password.focus();
        this.password = null;
      }
    },

    validate() {
      if (!this.phoneInput) return 'Nomor handphone tidak boleh kosong';
      if (!this.password) return 'Password tidak boleh kosong';
    },

    setPhoneNumber() {
      const appendPhoneNumber = this.phoneInput.substr(0, 2);
      if (appendPhoneNumber === '08') {
        this.phone = '+62' + this.phoneInput.slice(1, 13);
        return;
      }
      if (appendPhoneNumber.substr(0, 1) === '8') {
        this.phone = '+62' + this.phoneInput.slice(0, 13);
        return;
      }
      this.phone = this.phoneInput;
    },
  },
};
</script>

<style lang="scss" scoped>
.login-page {
  background-image: url('/img/bg-login.webp');
  background-repeat: no-repeat;
  background-size: cover;
}

.gradient-background {
  background: linear-gradient(120deg, rgba(235, 235, 235, 0.92) 39%, rgba(185, 185, 185, 0) 66%);
}

.flag-indonesia {
  background-image: asset('/img/bg-login.png');
}

.form-input {
  font-size: 1.4em;
  font-weight: bold;
}

.title {
  font-size: 42px;
  font-weight: 800;
  color: $grey-10;
}

.subtitle {
  font-size: 32px;
  line-height: 0.8em;
  color: $grey-10;
}

.q-btn {
  border-radius: 0.6em;
}

@media screen and (max-width: 599px) {
  .gradient-background {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(4px);
  }
}
</style>
