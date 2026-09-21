<script setup lang="ts">
import { SIcon, SSwitch } from '@vean/ui';
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-wrap gap-6">
      <SSwitch
        color="carbon"
        default-value="on"
        true-value="on"
        false-value="off"
        :ui="{ root: 'flex-y-center gap-2' }"
      >
        <template #leading="{ modelValue }">
          <div :class="{ 'text-muted-foreground opacity-50': modelValue === 'on' }">off</div>
        </template>
        <template #trailing="{ modelValue }">
          <div :class="{ 'text-muted-foreground opacity-50': modelValue === 'off' }">on</div>
        </template>
      </SSwitch>
      <SSwitch
        color="carbon"
        shape="square"
        default-value="on"
        true-value="on"
        false-value="off"
        :ui="{ root: 'flex-y-center gap-2' }"
      >
        <template #trailing="{ modelValue }">
          <div>{{ modelValue }}</div>
        </template>
      </SSwitch>
      <SSwitch color="carbon" :default-value="true" :ui="{ root: 'flex-y-center gap-2' }">
        <template #leading="{ modelValue }">
          <SIcon icon="lucide:sun" :class="{ 'text-muted-foreground opacity-50': !modelValue }" />
        </template>
        <template #trailing="{ modelValue }">
          <SIcon icon="lucide:moon" :class="{ 'text-muted-foreground opacity-50': modelValue }" />
        </template>
      </SSwitch>
      <SSwitch
        color="carbon"
        shape="square"
        :default-value="1"
        :true-value="1"
        :false-value="0"
        :ui="{ root: 'flex-y-center gap-2' }"
      >
        <template #trailing="{ modelValue }">
          <SIcon :icon="modelValue === 1 ? 'lucide:sun' : 'lucide:moon'" />
        </template>
      </SSwitch>
      <SSwitch :default-value="true" color="carbon" size="2xl" :ui="{ root: 'relative' }">
        <template #trailing="{ modelValue }">
          <span
            class="pointer-events-none absolute inset-0 flex items-center justify-center w-1/2 text-2xs transition-transform duration-300"
            :class="{ 'text-background': modelValue, 'translate-x-full': !modelValue }"
          >
            {{ modelValue ? 'on' : 'off' }}
          </span>
        </template>
      </SSwitch>
      <SSwitch :default-value="true" color="carbon" shape="square" size="2xl" :ui="{ root: 'relative' }">
        <template #trailing="{ modelValue }">
          <span
            class="pointer-events-none absolute inset-0 flex items-center justify-center w-1/2 text-2xs transition-transform duration-300"
            :class="{ 'text-background': modelValue, 'translate-x-full': !modelValue }"
          >
            <SIcon :icon="modelValue ? 'lucide:sun' : 'lucide:moon'" />
          </span>
        </template>
      </SSwitch>
      <SSwitch v-slot="{ modelValue }" :default-value="true" color="carbon" size="2xl" :ui="{ root: 'relative' }">
        <SIcon :icon="modelValue ? 'lucide:moon' : 'lucide:sun'" />
      </SSwitch>
    </div>
  </div>
</template>
