<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Link as UbeanLink } from 'ubean';
import { SConfigProvider } from '@vean/ui';

const { locale } = useI18n();
</script>

<template>
  <SConfigProvider :locale="locale" :link-component="UbeanLink" persist-theme>
    <slot />
  </SConfigProvider>
</template>
