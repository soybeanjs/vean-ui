<script setup lang="ts">
import { SButton, useTheme } from '@vean/ui';

// 主题状态由 `SConfigProvider`（库内）统一管理，这里是其后代，可安全消费 `useTheme`。
const { savePreset, applyPreset, resetPreset, appliedPresetName } = useTheme('DemoPresetToggle');

const DEMO_PRESET_NAME = 'brand-demo';

const toggleDemoPreset = () => {
  if (appliedPresetName.value) {
    resetPreset();
  } else {
    savePreset(DEMO_PRESET_NAME);
    applyPreset(DEMO_PRESET_NAME);
  }
};
</script>

<template>
  <SButton class="fixed top-20 right-4 z-10" size="sm" variant="outline" @click="toggleDemoPreset">
    {{ appliedPresetName ? 'Reset demo preset' : 'Save & apply demo preset' }}
  </SButton>
</template>
