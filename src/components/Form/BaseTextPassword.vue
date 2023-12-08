<template>
  <validation-provider :name="name" :rules="rules" v-slot="{ errors, invalid, validated }">
    <div class="label-input" :class="{ required: isRequired }">{{ name }}</div>
    <q-input
      v-model="currentValue"
      :type="obsecure ? 'password' : 'text'"
      :error="invalid && validated"
      :error-message="errors[0]"
      class="app-input"
      bg-color="white"
      v-bind="$attrs"
      v-on="$listeners"
      color="blue"
      outlined
      dense
      hide-bottom-space
    >
      <template v-slot:append>
        <q-icon :name="obsecure ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="obsecure = !obsecure" /> </template
    ></q-input>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'TextInput',
  components: { ValidationProvider },
  props: {
    value: { type: [String, Number], default: '' },
    rules: { type: [String, Object], default: '' },
    name: { type: String, default: '' },
  },
  data() {
    return { obsecure: true };
  },
  computed: {
    isRequired: function() {
      return this.rules.includes('required');
    },
    currentValue: {
      get(value) {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  mounted() {
    this.currentValue = this.value;
  },
};
</script>

<style lang="scss" scoped></style>
