<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButtonIcon, SLocaleSelect, SSelect, SSwitch } from '@vean/ui';
import type { ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t, locale } = useI18n();

interface CustomizerState {
  size: ThemeSize;
  showIcon: boolean;
}

const DEFAULTS: CustomizerState = {
  size: 'md',
  showIcon: true
};

const size = shallowRef(DEFAULTS.size);
const showIcon = shallowRef(DEFAULTS.showIcon);

/** The demo drives the docs site's own locale, so the switch is visible. */
const selected = computed({
  get: () => locale.value,
  set: (value: string) => {
    locale.value = value;
  }
});

const reset = (): void => {
  size.value = DEFAULTS.size;
  showIcon.value = DEFAULTS.showIcon;
};

const iconMap: Record<string, string> = {
  'zh-CN': 'lucide:languages',
  en: 'lucide:spell-check-2'
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="showIcon">
        <div class="h-8 flex items-center">
          <SSwitch v-model="showIcon" :control-props="{ 'aria-label': 'Show icon' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SLocaleSelect v-model:locale="selected" :size="size" :show-icon="showIcon" :icons="iconMap" class="w-42" />
  </div>
</template>
