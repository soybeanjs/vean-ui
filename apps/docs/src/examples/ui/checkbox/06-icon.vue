<script setup lang="ts">
import { SCheckbox, SIcon } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <SCheckbox class="max-w-2xl" :default-value="true" shape="rounded" label="Rounded">
      <template #indicator>
        <SIcon icon="mdi:check-bold" class="size-full" />
      </template>
    </SCheckbox>
  </div>
</template>
