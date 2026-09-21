<script setup lang="ts">
import { SAlert, SIcon } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SAlert class="max-w-2xl" color="success" variant="outline" title="Flighting !!!">
      <template #leading>
        <SIcon icon="lucide:arrow-left" />
      </template>
      <template #trailing>
        <SIcon icon="lucide:arrow-right" />
      </template>
    </SAlert>
  </div>
</template>
