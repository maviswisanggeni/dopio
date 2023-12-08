<template>
  <validation-provider :name="name" :rules="rules" v-slot="{ errors, invalid, validated }">
    <div class="label-input" :class="{ required: isRequired }">{{ name }}</div>
    <q-field
      v-model="currentValue"
      :error="invalid && validated"
      :error-message="errors[0]"
      v-bind="$attrs"
      class="app-input"
      color="blue"
      outlined
      dense
      hide-bottom-space
    >
      <template v-slot:control="{ value, emitValue }">
        <money
          class="q-field__input text-left"
          v-bind="money"
          v-bind:class="[right ? 'text-right' : '']"
          :value="value"
          @input="emitValue"
          :readonly="readonly"
        />
      </template>
    </q-field>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'TextInput',
  components: { ValidationProvider },
  props: {
    name: { type: String, default: '' },
    value: { required: true, default: 0 },
    rules: { type: [String, Object], default: '' },
    right: { type: Boolean, default: true },
    readonly: { type: Boolean, default: false },
  },

  data() {
    return {
      money: { decimal: ',', thousands: '.', precision: 0 },
    };
  },

  computed: {
    isRequired: function() {
      return this.rules.includes('required');
    },
    currentValue: {
      get(value) {
        if (!this.value) return 0;
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
