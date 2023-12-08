<template>
  <div class="q-pb-md">
    <ValidationProvider
      :rules="rules"
      :name="getKeyName"
      v-slot="{ errors, invalid, validated }"
    >
      <label for=""
        >{{ name }}
        <span class="text-negative">{{ isRequired ? "*" : "" }}</span></label
      >
      <q-file
        outlined
        :dense="dense"
        v-model="currentValue"
        accept=".png,.jpeg,.jpg, image/*"
        :error="invalid && validated"
        :error-message="errors[0]"
        :class="{ required: isRequired }"
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";

export default {
  name: "FileUpload",
  components: {
    ValidationProvider
  },
  props: {
    value: { type: File, default: null },
    icon: { type: String, default: null },
    rules: { type: [String, Object], default: "" },
    name: { type: String, default: "" },
    index: { type: Number, default: null },
    readonly: { type: Boolean, default: false },
    dense: { type: Boolean, default: true },
    url: { type: String, default: process.env.SERVER_URL }
  },

  computed: {
    getKeyName() {
      if (!this.index) return this.name;
      return `${this.name} - ${this.index + 1}`;
    },
    isRequired: function() {
      return this.rules.includes("required");
    },
    currentValue: {
      get(value) {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },

  mounted() {
    this.currentValue = this.value;
  }
};
</script>
