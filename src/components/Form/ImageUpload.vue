<template>
  <div>
    <ValidationProvider :rules="rules" v-slot="{ errors, invalid, validated }">
      <q-avatar
        :square="square"
        v-if="!userAvatar"
        @click="$refs.FileInput.pickFiles()"
        :size="size"
        class="cursor-pointer"
        color="primary"
        text-color="white"
        >{{ name | avatar }}</q-avatar
      >
      <q-avatar
        :square="square"
        v-if="userAvatar"
        class="cursor-pointer"
        :size="size"
        @click="$refs.FileInput.pickFiles()"
      >
        <img style="object-fit:cover" :src="userAvatar" />
      </q-avatar>
      <q-file
        ref="FileInput"
        style="display: none;"
        v-model="currentValue"
        accept=".jpg,.jpeg,.png image/*"
        @input="onFileSelect"
      />

      <q-dialog persistent v-model="dialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Alert</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <VueCropper
              v-show="currentValue"
              :error="invalid && validated"
              :error-message="errors[0]"
              ref="cropper"
              :src="currentValue"
              alt="Source Image"
            >
            </VueCropper>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from "vee-validate";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { size } from "vee-validate/dist/rules";

export default {
  name: "ImageUpload",

  components: {
    ValidationProvider,
    VueCropper
  },

  props: {
    value: { type: [File, Array, String], default: null },
    rules: { type: [String, Object], default: "" },
    dense: { type: Boolean, default: true },
    name: { type: String },
    size: { type: String, default: "100px" },
    square: { type: Boolean, default: false }
  },
  data() {
    return {
      userAvatar: null,
      mime_type: null,
      dialog: false
    };
  },

  computed: {
    isRequired: function() {
      return this.rules.includes("required");
    },
    currentValue: {
      get() {
        if (typeof this.value === "string") return null;
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },

  mounted() {
    if (typeof this.value === "string") {
      this.userAvatar = this.value;
    } else {
      this.currentValue = this.value;
    }
  },
  methods: {
    onFileSelect(e) {
      if (typeof FileReader === "function") {
        const reader = new FileReader();
        reader.onload = event => {
          this.userAvatar = event.target.result;
          // this.$refs.FileInput.addFiles(e);
        };
        reader.readAsDataURL(e);
      } else {
        alert("Sorry, FileReader API not supported");
      }
    }
  }
};
</script>
<style></style>
