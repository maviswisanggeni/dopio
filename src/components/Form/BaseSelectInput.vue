<template>
  <validation-provider :name="name" :rules="rules" v-slot="{ errors, invalid, validated }">
    <div class="label-input" :class="{ required: isRequired }">{{ name }}</div>
    <q-select
      v-model="currentValue"
      :value="value"
      :options="opt"
      :error="invalid && validated"
      :error-message="errors[0]"
      class="app-input"
      bg-color="white"
      v-bind="$attrs"
      :use-input="filter"
      :hide-selected="filter"
      :fill-input="filter"
      @filter="filterFn"
      outlined
      emit-value
      map-options
      dense
      options-dense
      hide-bottom-space
      debounce="0"
    />
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
  name: 'SelectInput',

  components: {
    ValidationProvider,
  },

  props: {
    value: { type: [Number, String, Object], default: '' },
    required: { type: Boolean, default: false },
    rules: { type: [String, Object], default: '' },
    name: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    filter: { type: Boolean, default: false },
  },

  data() {
    return {
      opt: this.options,
      props: this.$attrs['option-label'] || 'label',
    };
  },

  watch: {},

  computed: {
    isRequired() {
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

  created() {},

  methods: {
    updateOpts(val) {
      this.opt = val;
    },
    filterFn(val, update, abort) {
      if (!this.filter) return update();
      update(
        () => {
          const needle = val.toLowerCase();
          this.opt = this.options.filter(v => v[this.props].toLowerCase().indexOf(needle) > -1);
        },
        ref => {
          if (val !== '' && ref.options.length > 0) {
            ref.setOptionIndex(-1); // reset optionIndex in case there is something selected
            ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
          }
        },
      );
    },
  },
};
</script>
