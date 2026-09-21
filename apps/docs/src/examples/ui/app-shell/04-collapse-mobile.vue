<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { SAppShell, SIcon, SSelect, SSwitch } from '@vean/ui';
import type { AppShellMode, SelectOptionData } from '@vean/ui';
import { appShellItems } from './menu';

const open = ref(true);

// `isMobile` is optional: unset follows the viewport, so the switch only has to
// pin it to `true` and hand `undefined` back to let the shell decide again.
const isMobile = useMediaQuery('(max-width: 767.9px)');

const forceMobile = ref(false);

// The mobile view renders the sidebar skeleton whatever mode is bound: flip the
// switch with either mode selected and the menu still lands in the drawer, in
// full.
const modes: SelectOptionData<AppShellMode>[] = [
  { value: 'sidebar', label: 'sidebar' },
  { value: 'top', label: 'top' }
];

const mode = shallowRef<AppShellMode>('sidebar');

const active = ref('overview');
</script>

<template>
  <div class="space-y-4">
    <div class="flex-y-center flex-wrap gap-4">
      <SSelect v-model="mode" :items="modes" class="w-40" />
      <div class="flex-y-center gap-2">
        <span>open:</span>
        <SSwitch v-model="open" class="items-center" />
      </div>
      <div class="flex-y-center gap-2">
        <span>isMobile:</span>
        <SSwitch v-model="forceMobile" class="items-center" />
      </div>
      <span class="text-muted-foreground">viewport mobile: {{ isMobile }}</span>
    </div>
    <div class="h-120 w-full border border-border border-solid rounded-md overflow-hidden">
      <SAppShell
        v-model="active"
        v-model:open="open"
        :mode="mode"
        :items="appShellItems"
        :is-mobile="forceMobile ? true : undefined"
      >
        <template #logo>
          <SIcon icon="lucide:hexagon" class="size-6 text-primary" />
        </template>
        <template #title>
          <span class="truncate font-semibold">Vean UI</span>
        </template>
        <div class="p-4">
          <p class="text-muted-foreground">
            On mobile the shell renders the sidebar skeleton whatever mode is bound: the sidebar becomes a dialog and
            the drawer holds the full menu tree, so a top bar moves into it. The header keeps the trigger.
          </p>
        </div>
      </SAppShell>
    </div>
  </div>
</template>
