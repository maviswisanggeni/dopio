<template>
  <validation-provider :name="name" :rules="rules" v-slot="{ errors, invalid, validated }">
    <div class="label-input" :class="{ required: isRequired }">{{ name }}</div>
    <q-input
      v-model="currentValue"
      type="textarea"
      :error="invalid && validated"
      :error-message="errors[0]"
      class="app-text-area"
      :rows="rows"
      v-bind="$attrs"
      color="blue"
      outlined
      dense
      hide-bottom-space
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
    type: { type: String, default: 'text' },
    rows: { type: String, default: '3' },
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

<style lang="scss"></style>
