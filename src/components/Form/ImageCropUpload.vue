<template>
  <div>
    <q-avatar class="avatar" :size="size" rounded color="primary" text-color="white">
      <img v-if="image" style="object-fit:cover" :src="image" />
      <span v-else>{{ name | avatar }}</span>
      <div class="absolute-bottom row justify-around action">
        <q-icon class="text-blue cursor-pointer" name="edit" @click="$refs.FileInput.pickFiles()"></q-icon>
        <q-separator vertical class="bg-grey-4" />
        <q-icon class="text-negative cursor-pointer" @click="deleteImage()" name="delete"></q-icon>
      </div>
    </q-avatar>

    <q-file ref="FileInput" style="display: none;" v-model="currentValue" accept=".jpg,.jpeg,.PNG,.png image/*" @input="onFileSelect" />

    <q-dialog v-model="dialog">
      <q-card>
        <div class="row items-center justify-between bg-grey-1 q-pa-xs">
          <div class="q-ml-xs">Crop</div>
          <q-btn padding="4px" size="8px" flat icon="close" v-close-popup></q-btn>
        </div>
        <cropper
          v-if="previewImage"
          ref="cropper"
          class="cropper"
          :stencil-props="{
            aspectRatio: 1,
          }"
          :src="previewImage"
        />
        <div class="row q-pa-xs bg-grey-1">
          <q-space></q-space>
          <q-btn padding="2px 8px" flat color="primary" size="12px" label="Ok" @click="cropImage"></q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageCropUpload',

  props: {
    value: { type: [File, Array, String, Blob], default: null },
    name: { type: String },
    size: { type: String, default: '100px' },
  },

  data() {
    return {
      image: null,
      previewImage: null,
      file: {},
      dialog: false,
      currentValue: null,
    };
  },

  computed: {
    isRequired: function() {
      return this.rules.includes('required');
    },
  },

  mounted() {
    if (!this.value) return;
    if (typeof this.value === 'string') {
      this.image = this.value;
      return;
    }
    if (typeof this.value === 'object') {
      const reader = new FileReader();
      reader.onload = event => {
        this.image = event.target.result;
      };
      reader.readAsDataURL(this.value);
      this.image = this.value;
    }
  },

  methods: {
    onFileSelect(e) {
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = event => {
          if (this.previewImage != event.target.result) this.previewImage = event.target.result;
        };
        reader.readAsDataURL(e);
        this.file = e;
      } else {
        alert('Sorry, FileReader API not supported');
      }
      this.dialog = true;
    },
    cropImage() {
      if (!this.file) return;
      const result = this.$refs.cropper.getResult();
      this.image = result.canvas.toDataURL(this.file.type);
      if (result.canvas) {
        result.canvas.toBlob(blobData => {
          this.currentValue = new File([blobData], this.file.name);
          this.$emit('input', this.currentValue);
          this.dialog = false;
        }, this.file.type);
      }
    },
    deleteImage() {
      this.image = null;
      this.currentValue = null;
      this.$emit('input', null);
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar .action {
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
  font-size: 14px;
  padding: 4px;
}

.avatar:hover .action {
  visibility: visible;
  opacity: 1;
  transition: 0.5s;
  background-color: rgba(0, 0, 0, 0.6);
}

.cropper {
  height: 300px;
  width: 100%;
  background-color: black;
}

.crop-btn {
  color: white;
}

.text-btn {
  color: black;
  cursor: pointer;
  text-align: center;
  font-size: 14px;
}
</style>
