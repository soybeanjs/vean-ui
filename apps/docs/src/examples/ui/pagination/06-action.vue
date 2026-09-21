<script setup lang="ts">
import { SPagination } from '@vean/ui';
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <p>When actionVariant is true, the action button will use the variant styling</p>
    <SPagination show-edges :sibling-count="1" :items-per-page="10" :total="200" action-variant>
      <template #prev>Prev</template>
      <template #next>Next</template>
    </SPagination>
  </div>
</template>
