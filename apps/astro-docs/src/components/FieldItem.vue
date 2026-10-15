<script setup lang="ts">
interface Props {
  label: string;
}

defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <span class="pl-0.5 text-xs text-muted-foreground">{{ label }}</span>
    <slot></slot>
  </div>
</template>
