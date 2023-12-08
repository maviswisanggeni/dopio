<template>
  <validation-observer ref="observer">
    <q-form @submit.prevent>
      <slot></slot>
    </q-form>
  </validation-observer>
</template>

<script>
import { ValidationObserver } from 'vee-validate';

export default {
  name: 'BaseForm',
  components: { ValidationObserver },
  props: {
    onSubmit: Function,
  },
  methods: {
    async validate() {
      return await this.$refs.observer.validate();
    },
    reset() {
      return this.$refs.observer.reset();
    },
  },
};
</script>

<style></style>
