<template>
  <q-btn class="full-width" style="" type="submit" color="primary" :label="text" :loading="isLoading" :disable="isLoading" @click="$emit('click')">
    <template v-slot:loading>
      <q-spinner class="q-mr-md" color="white" size="16px" />
      <span class="">{{ text }}</span>
      <div class="q-ml-md" style="width:16px"></div>
    </template>
  </q-btn>
</template>

<script>
export default {
  name: 'SaveButton',
  props: {
    isLoading: { type: Boolean, default: false },
    text: { type: String, default: 'Simpan' },
  },
};
</script>
