<script setup lang="ts">
import { SPagination } from '@vean/ui';
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <p>When showFirstOrLast is false, the first and last buttons will not be shown</p>
    <SPagination
      show-edges
      :sibling-count="1"
      :items-per-page="10"
      :total="200"
      action-variant
      :show-first-or-last="false"
    />
  </div>
</template>
