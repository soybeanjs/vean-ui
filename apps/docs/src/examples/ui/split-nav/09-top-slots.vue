<script setup lang="ts">
import { shallowRef } from 'vue';
import { SIcon, SSplitNav, SSwitch } from '@vean/ui';
import { splitNavItems } from './data';

const active = shallowRef('vean-ui');

/** Whether the nested pane is folded; the menu keeps it, the cells read it. */
const collapsed = shallowRef(false);
</script>

<template>
  <div class="flex flex-col gap-4">
    <FieldItem label="collapsed">
      <div class="h-8 flex items-center">
        <SSwitch v-model="collapsed" :control-props="{ 'aria-label': 'Collapsed' }" />
      </div>
    </FieldItem>

    <!--
      A dual-vertical menu owns the cells above its two columns: `top-left` keeps
      the rail's width and divider, `top-right` follows the pane column and only
      exists while that column does. Both report the pane's folded state, which
      is what a brand cell needs to decide whether it still has a column to sit
      on — the title drops out once the pane folds into its icon rail.
    -->
    <div class="h-110 border rounded-md bg-sidebar">
      <SSplitNav v-model="active" v-model:collapsed="collapsed" mode="dual-vertical" :items="splitNavItems">
        <template #top-left>
          <div class="h-14 flex w-full items-center justify-center">
            <SIcon icon="lucide:hexagon" class="size-6 text-primary" />
          </div>
        </template>
        <template #top-right="{ collapsed: paneCollapsed }">
          <div class="h-14 min-w-0 flex items-center justify-center px-3">
            <span v-if="!paneCollapsed" class="truncate font-semibold">Soybean UI</span>
          </div>
        </template>
      </SSplitNav>
    </div>
  </div>
</template>
