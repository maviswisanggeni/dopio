<template>
  <validation-provider :rules="rules" :name="name" v-slot="{ errors, invalid, validated }">
    <div class="label-input" :class="{ required: isRequired }">{{ name }}</div>
    <q-input
      v-model="currentValue"
      :error="isError(invalid, validated)"
      :error-message="errors[0]"
      :class="{ required: isRequired }"
      mask="##-##-####"
      class="app-input"
      bg-color="white"
      v-bind="$attrs"
      @blur="clearIfNotValid"
      outlined
      dense
      hide-bottom-space
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="currentValue" mask="DD-MM-YYYY" @input="() => $refs.qDateProxy.hide()" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'BaseDateInput',

  components: {
    ValidationProvider,
  },

  props: {
    value: { type: String, default: '' },
    required: { type: Boolean, default: false },
    rules: { type: [String, Object], default: '' },
    name: { type: String, default: '' },
  },

  computed: {
    isRequired() {
      return this.rules.includes('required');
    },
  },

  watch: {
    currentValue(value) {
      if (value == null || value == '') return this.$emit('input', null);
      if (value.length < 10) return;
      if (!this.isDateValid()) return;

      const input = this.currentValue
        .split('-')
        .reverse()
        .join('-');

      this.$emit('input', input);
    },
    value(val) {
      if (!val) return;
      this.currentValue = val
        .split('-')
        .reverse()
        .join('-');
    },
  },

  mounted() {
    if (!this.value) return;
    this.currentValue = this.value
      .split('-')
      .reverse()
      .join('-');
  },

  data: () => ({
    currentValue: '',
  }),

  methods: {
    isError(invalid, validated) {
      if (!this.rules) return undefined;
      return invalid && validated;
    },
    isDateValid() {
      if (this.currentValue.length < 10) return false;
      if (!this.currentValue || this.currentValue == '') return false;
      const [day, month, year] = this.currentValue.split('-');
      if (!day || !month || !year) return false;
      const date = new Date(`${year}-${month}-${day}`);
      return date instanceof Date && !isNaN(date);
    },
    clearIfNotValid(evt) {
      if (this.isDateValid() == false) {
        this.currentValue = null;
        this.$emit('input', null);
      }
    },
  },
};
</script>
