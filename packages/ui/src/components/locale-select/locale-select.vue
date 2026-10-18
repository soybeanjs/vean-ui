<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import type { IconValue } from '@vean/aria';
import { listLocales } from '@vean/aria/locale';
import { useConfigProvider } from '../config-provider/context';
import SIcon from '../icon/icon.vue';
import SSelect from '../select/select.vue';
import type { SelectOptionData } from '../select/types';
import type { LocaleSelectProps } from './types';

defineOptions({
  name: 'SLocaleSelect'
});

const props = withDefaults(defineProps<LocaleSelectProps>(), {
  locale: undefined,
  locales: undefined,
  size: 'md',
  showIcon: false,
  icons: undefined,
  triggerIcon: 'lucide:languages',
  placeholder: 'Select a locale',
  ariaLabel: 'Language'
});

const emit = defineEmits<{
  'update:locale': [value: string];
}>();

/**
 * Optional UI-provider consumer: `SConfigProvider` supplies the resolved
 * `locale`, so an uncontrolled instance starts on the app locale.
 */
const context = useConfigProvider();

/**
 * Uncontrolled display state. `SConfigProvider.locale` is a prop, not writable
 * state, so a pick cannot be written back into the provider — without this the
 * trigger would keep rendering the initial label after a selection.
 */
const uncontrolledLocale = shallowRef<string>(props.locale ?? context?.locale ?? 'en');

watch(
  () => props.locale ?? context?.locale,
  next => {
    if (next) {
      uncontrolledLocale.value = next;
    }
  }
);

/** Controlled value wins; otherwise the internal value (seeded from the provider). */
const activeLocale = computed(() => props.locale ?? uncontrolledLocale.value);

/**
 * Derived from the registry on every read, so a `registerLocale()` call made
 * after mount (or a changed `locales` prop) is reflected without a cache to
 * invalidate.
 */
const items = computed<SelectOptionData<string>[]>(() => {
  const registered = listLocales();
  const wanted = props.locales;

  if (!wanted) {
    return registered.map(entry => toOption(entry.key, entry.name));
  }

  const byKey = new Map(registered.map(entry => [entry.key, entry]));

  return wanted.flatMap(key => {
    const entry = byKey.get(key);

    return entry ? [toOption(entry.key, entry.name)] : [];
  });
});

const selectedLabel = computed(() => {
  const match = items.value.find(item => !('items' in item) && item.value === activeLocale.value);

  return match && !('items' in match) ? match.label : props.placeholder;
});

/** Unregistered keys get no icon rather than a misleading one. */
function toOption(value: string, label: string): SelectOptionData<string> {
  const icon = props.showIcon ? props.icons?.[value] : undefined;

  return icon ? { value, label, icon } : { value, label };
}

const triggerIconValue = computed<IconValue>(() => props.icons?.[activeLocale.value] ?? props.triggerIcon);

function onValueChange(value: string | number | (string | number)[] | undefined): void {
  if (typeof value !== 'string') {
    return;
  }

  uncontrolledLocale.value = value;
  emit('update:locale', value);
}
</script>

<template>
  <SSelect
    :model-value="activeLocale"
    :items="items"
    :size="size"
    :trigger-props="{ 'aria-label': ariaLabel }"
    @update:model-value="onValueChange"
  >
    <template v-if="showIcon" #trigger-leading>
      <SIcon :icon="triggerIconValue" />
    </template>
    <template #trigger-value>{{ selectedLabel }}</template>
  </SSelect>
</template>
