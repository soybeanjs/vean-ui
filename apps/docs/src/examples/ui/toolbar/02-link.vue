<script setup lang="ts">
import { SToolbar, SToolbarButton, SToolbarLink, SToolbarSeparator } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SToolbar class="max-w-2xl">
      <SToolbarButton>Back</SToolbarButton>
      <SToolbarSeparator />
      <SToolbarLink href="https://soybeanjs.cn" target="_blank" rel="noopener noreferrer">Website</SToolbarLink>
      <SToolbarLink href="https://github.com/soybeanjs/vean-ui" target="_blank" rel="noopener noreferrer">
        GitHub
      </SToolbarLink>
    </SToolbar>
  </div>
</template>
