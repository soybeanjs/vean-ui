<script setup lang="ts">
import { SButton, SIcon } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-wrap gap-12px">
      <SButton color="primary">
        <template #leading>
          <SIcon icon="lucide:plus" />
        </template>
        leading
      </SButton>
      <SButton color="destructive" variant="outline">
        After
        <template #trailing>
          <SIcon icon="lucide:minus" />
        </template>
      </SButton>
      <SButton color="success" variant="dashed">
        <template #leading>
          <SIcon icon="lucide:plus" />
        </template>
        Both
        <template #trailing>
          <SIcon icon="lucide:minus" />
        </template>
      </SButton>
    </div>
  </div>
</template>
