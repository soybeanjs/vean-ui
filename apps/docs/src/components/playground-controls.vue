<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SegmentOptionData } from '@vean/ui';
import { playgroundDeviceMetas, playgroundDevices, playgroundTabs } from '~/constants/playground';
import type { PlaygroundDevice, PlaygroundTab } from '~/constants/playground';

interface Props {
  /** Device of the frame this strip drives. */
  device: PlaygroundDevice;
  /**
   * View being shown.
   *
   * Omitted by the fullscreen layer: a lifted preview owns the device and the way
   * out, but never switches away from the preview it was lifted from.
   */
  tab?: PlaygroundTab;
  /** Whether the strip owns the exit affordance of a lifted preview. */
  exitVisible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tab: undefined,
  exitVisible: false
});

interface Emits {
  (e: 'update:device', value: PlaygroundDevice): void;
  (e: 'update:tab', value: PlaygroundTab): void;
  (e: 'exit'): void;
}

const emit = defineEmits<Emits>();

/** Device entry: the meta contributes both the icon and the frame-size hint. */
interface DeviceOption extends SegmentOptionData<PlaygroundDevice> {
  icon: string;
  hint: string;
}

/** View entry: the icon keeps the two views readable at `sm` size. */
interface TabOption extends SegmentOptionData<PlaygroundTab> {
  icon: string;
}

const { t } = useI18n();

const deviceOptions = computed<DeviceOption[]>(() =>
  playgroundDevices.map(device => ({
    value: device,
    label: t(`playground.device.${device}`),
    ...playgroundDeviceMetas[device]
  }))
);

const tabOptions = computed<TabOption[]>(() => [
  { value: 'preview', label: t('playground.preview'), icon: 'lucide:eye' },
  { value: 'code', label: t('playground.code'), icon: 'lucide:code' }
]);

const hint = computed(() => playgroundDeviceMetas[props.device].hint);

/**
 * Both switchers are segment lists, i.e. `tablist`s without a panel of their own,
 * and they sit side by side inside one card header — so each one has to carry a
 * name, otherwise a screen reader reads two anonymous lists in a row.
 */
const deviceListProps = computed(() => ({ 'aria-label': t('playground.switcher.device') }));

const tabListProps = computed(() => ({ 'aria-label': t('playground.switcher.view') }));

function isOneOf<T extends string>(options: readonly T[], value: unknown): value is T {
  return options.some(option => option === value);
}

/** The switcher knows its own option table, so it narrows the payload before emitting. */
function handleDeviceChange(value: unknown) {
  if (isOneOf(playgroundDevices, value)) {
    emit('update:device', value);
  }
}

function handleTabChange(value: unknown) {
  if (isOneOf(playgroundTabs, value)) {
    emit('update:tab', value);
  }
}

function handleExit() {
  emit('exit');
}
</script>

<template>
  <!--
    The header is the only host of this strip, and a card gets narrower than the four
    labelled device items on a phone — so below `sm` the strip drops to icons, and the
    labels stay in the accessible name through `sr-only` instead of being removed.
  -->
  <div class="ml-auto flex flex-wrap items-center justify-end gap-2">
    <span class="hidden font-mono text-xs text-muted-foreground sm:inline">{{ hint }}</span>
    <SSegment
      :items="deviceOptions"
      :model-value="device"
      size="sm"
      shape="rounded"
      :list-props="deviceListProps"
      @update:model-value="handleDeviceChange"
    >
      <template #item="{ icon, label }">
        <SIcon :icon="icon" />
        <span class="sr-only whitespace-nowrap! sm:not-sr-only">{{ label }}</span>
      </template>
    </SSegment>
    <SSegment
      v-if="tab"
      :items="tabOptions"
      :model-value="tab"
      size="sm"
      shape="rounded"
      :list-props="tabListProps"
      @update:model-value="handleTabChange"
    >
      <template #item="{ icon, label }">
        <SIcon :icon="icon" />
        <span class="sr-only whitespace-nowrap! sm:not-sr-only">{{ label }}</span>
      </template>
    </SSegment>
    <SButtonIcon
      v-if="exitVisible"
      icon="lucide:minimize-2"
      size="sm"
      :aria-label="t('playground.device.exit_fullscreen')"
      @click="handleExit"
    />
  </div>
</template>
