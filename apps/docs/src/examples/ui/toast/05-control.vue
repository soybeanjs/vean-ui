<script setup lang="ts">
import { ref } from 'vue';
import { SButton, toast } from '@vean/ui';

const activeToastId = ref<number | string | null>(null);

function createUpdatableToast() {
  activeToastId.value = toast.loading('Deploying preview', {
    description: 'Build job created and queued.',
    duration: Infinity,
    dismissible: false
  });
}

function updateExistingToast() {
  if (!activeToastId.value) {
    createUpdatableToast();
    return;
  }

  toast.success('Preview ready', {
    id: activeToastId.value,
    description: 'The deployment finished and is ready for QA review.',
    duration: 3200,
    dismissible: true,
    showClose: true
  });
}

function dismissActiveToast() {
  if (!activeToastId.value) return;

  toast.dismiss(activeToastId.value);
  activeToastId.value = null;
}

function dismissAllToasts() {
  toast.dismiss();
  activeToastId.value = null;
}
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-wrap gap-2">
      <SButton variant="pure" @click="createUpdatableToast">Create Updatable Toast</SButton>
      <SButton color="success" variant="outline" @click="updateExistingToast">Update Existing Toast</SButton>
      <SButton color="warning" variant="outline" @click="dismissActiveToast">Dismiss Current</SButton>
      <SButton color="destructive" variant="outline" @click="dismissAllToasts">Dismiss All</SButton>
    </div>
  </div>
</template>
