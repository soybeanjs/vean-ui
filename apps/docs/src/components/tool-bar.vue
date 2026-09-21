<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LocaleToggler from './locale-toggler.vue';
import ThemeConfigurator from './theme-configurator.vue';
import ThemeSchemaToggler from './theme-schema-toggler.vue';

const { t } = useI18n();

const toolbarActions = [
  {
    key: 'language',
    labelKey: 'layout.header.language',
    component: LocaleToggler
  },
  {
    key: 'theme-configurator',
    labelKey: 'layout.header.theme_configurator',
    component: ThemeConfigurator
  },
  {
    key: 'theme',
    labelKey: 'layout.header.theme',
    component: ThemeSchemaToggler
  }
] as const;
</script>

<template>
  <div class="flex-y-center gap-4">
    <SLink href="https://github.com/soybeanjs/vean-ui" :aria-label="t('layout.header.github')">
      <SButtonIcon icon="mdi:github" size="lg" />
    </SLink>
    <component :is="action.component" v-for="action in toolbarActions" :key="action.key" />
  </div>
</template>
