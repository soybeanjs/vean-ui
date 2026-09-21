<script setup lang="ts">
import { SButton, toast } from '@vean/ui';

function createRequest(shouldFail: boolean) {
  return new Promise<string>((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error('The upload service returned a 503 error.'));
        return;
      }

      resolve('Invoice #1024');
    }, 1500);
  });
}

function openPromiseToast(shouldFail: boolean) {
  toast.promise(() => createRequest(shouldFail), {
    loading: 'Uploading invoice...',
    description: result => {
      if (result instanceof Error) {
        return 'Retry the upload after the backend is healthy again.';
      }

      return typeof result === 'string'
        ? 'The API accepted the file and is generating a receipt.'
        : 'Preparing response data...';
    },
    success: invoiceId => `Uploaded ${invoiceId}`,
    error: error => (error instanceof Error ? error.message : 'Unexpected upload error')
  });
}
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-wrap gap-2">
      <SButton variant="pure" @click="openPromiseToast(false)">Resolve Promise</SButton>
      <SButton color="destructive" variant="outline" @click="openPromiseToast(true)">Reject Promise</SButton>
    </div>
  </div>
</template>
