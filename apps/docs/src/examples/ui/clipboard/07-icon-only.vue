<script setup lang="ts">
import { SClipboard } from '@vean/ui';

const value = 'icon-only-example';
</script>

<template>
  <div class="flex justify-center w-full">
    <SClipboard class="max-w-2xl" :value="value" only-icon color="accent" variant="soft" shape="square" />
  </div>
</template>
