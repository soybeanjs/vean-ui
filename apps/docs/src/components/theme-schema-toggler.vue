<script setup lang="ts">
import { useTheme } from '@vean/ui';

const { mode } = useTheme();
</script>

<template>
  <!-- `mode` is a 'light' | 'dark' string, so map the switch's boolean state to those values -->
  <SSwitch v-model="mode" color="accent" size="lg" true-value="dark" false-value="light">
    <SIcon :icon="mode === 'dark' ? 'lucide:moon' : 'lucide:sun'" />
  </SSwitch>
</template>
