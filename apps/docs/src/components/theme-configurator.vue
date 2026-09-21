<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { mobileViewportQuery } from '@vean/aria/shared';
import { SButtonIcon, SPopover, SThemeCustomizer } from '@vean/ui';

const isMobile = useMediaQuery(mobileViewportQuery);
</script>

<template>
  <SPopover :modal="false" :placement="isMobile ? 'left' : 'bottom-end'">
    <template #trigger>
      <SButtonIcon icon="lucide:swatch-book" size="lg" />
    </template>
    <SThemeCustomizer />
  </SPopover>
</template>
