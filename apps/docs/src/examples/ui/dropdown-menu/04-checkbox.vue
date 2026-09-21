<script setup lang="ts">
import { ref } from 'vue';
import { SButton, SDropdownMenuCheckbox } from '@vean/ui';
import type { MenuCheckboxOptionData } from '@vean/ui';

const modelValue = ref<string[]>(['vue', 'solid']);

const items = ref<MenuCheckboxOptionData<string>[]>([
  { isGroupLabel: true, value: 'JSFramework', label: 'JS Frameworks' },
  { value: 'vue', label: 'Vue', icon: 'logos:vue' },
  { value: 'react', label: 'React', icon: 'logos:react' },
  { value: 'angular', label: 'Angular', icon: 'logos:angular' },
  { value: 'svelte', label: 'Svelte', icon: 'logos:svelte' },
  { value: 'solid', label: 'Solid', icon: 'logos:solid' },
  { value: 'preact', label: 'Preact', icon: 'logos:preact' }
]);
</script>

<template>
  <div class="flex justify-center w-full">
    <SDropdownMenuCheckbox v-model="modelValue" class="max-w-2xl" :items="items">
      <template #trigger>
        <SButton variant="pure">Checkbox</SButton>
      </template>
    </SDropdownMenuCheckbox>
  </div>
</template>
