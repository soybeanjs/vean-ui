<script setup lang="ts">
import { ref } from 'vue';
import { SButton, SButtonLoading } from '@vean/ui';

const loading = ref(false);

const startLoading = () => {
  loading.value = true;
};

const endLoading = () => {
  loading.value = false;
};
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="flex flex-wrap gap-3">
      <SButtonLoading variant="pure" auto-loading :loading-duration="1000">Loading in Start</SButtonLoading>
      <SButtonLoading
        variant="outline"
        loading-text="Loading..."
        auto-loading
        :loading-duration="1000"
        loading-position="center"
      >
        Loading in Center
      </SButtonLoading>
      <SButtonLoading variant="soft" auto-loading :loading-duration="1000" loading-position="end">
        Loading in End
      </SButtonLoading>
    </div>
    <div class="flex flex-wrap gap-3 mt-4">
      <SButtonLoading color="accent" variant="solid" :loading="loading" @click="startLoading">
        Control Loading
      </SButtonLoading>
      <SButton v-if="loading" color="destructive" @click="endLoading">End Loading</SButton>
      <SButtonLoading color="info" variant="ghost" auto-loading :loading-duration="2000">
        Loading end in 2s
      </SButtonLoading>
    </div>
  </div>
</template>
