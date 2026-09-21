<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { SButton, SButtonIcon, SDropdownMenuRadio, STextarea } from '@vean/ui';
import type { MenuRadioOptionData } from '@vean/ui';

const mode = shallowRef('auto');

const modes: MenuRadioOptionData<string>[] = [
  {
    label: 'Auto',
    value: 'auto'
  },
  {
    label: 'Agent',
    value: 'agent'
  },
  {
    label: 'Manual',
    value: 'manual'
  }
];

const activeLabel = computed(() => modes.find(item => item.value === mode.value)?.label);
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-80 lt-md:w-auto">
      <STextarea :maxlength="200" placeholder="Ask, Search or Chat..." autosize>
        <template #footer>
          <div class="flex-y-center justify-between gap-2 px-2 py-1">
            <div class="flex-y-center gap-2">
              <SButtonIcon icon="lucide:plus" color="accent" variant="pure" shape="circle" />
              <SDropdownMenuRadio v-model="mode" :items="modes" :content-props="{ placement: 'top' }">
                <template #trigger>
                  <SButton color="accent" variant="ghost">{{ activeLabel }}</SButton>
                </template>
              </SDropdownMenuRadio>
            </div>
            <SButtonIcon icon="lucide:arrow-up" color="primary" variant="solid" shape="circle" />
          </div>
        </template>
      </STextarea>
    </div>
  </div>
</template>
