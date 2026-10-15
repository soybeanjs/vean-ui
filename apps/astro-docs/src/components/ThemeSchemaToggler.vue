<script setup lang="ts">
import { computed, ref } from 'vue';
import { readTheme, writeTheme, type ThemeMode } from '../theme-client';

/**
 * Port of `apps/docs/src/components/theme-schema-toggler.vue`.
 *
 * The ubean version is an `@vean/ui` `SSwitch` bound to `useTheme().mode`. Here the
 * switch is a plain button that writes the same `__VEAN_THEME` envelope and applies
 * the same DOM effects (`theme-client.ts` mirrors `packages/theme/src/ssr.ts`), so
 * the head script and this control stay in agreement.
 */
const props = defineProps<{ locale: 'en' | 'zh' }>();

const mode = ref<ThemeMode>(readTheme().mode);

const isDark = computed(() => mode.value === 'dark');
const label = computed(() => (props.locale === 'zh' ? '主题' : 'Theme'));

function toggle(): void {
  const next: ThemeMode = isDark.value ? 'light' : 'dark';
  mode.value = next;
  writeTheme({ ...readTheme(), mode: next });
}
</script>

<template>
  <button
    type="button"
    class="inline-flex size-9 items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-accent-foreground/10"
    :aria-label="label"
    :aria-pressed="isDark"
    @click="toggle"
  >
    <svg v-if="isDark" width="1.25em" height="1.25em" viewBox="0 0 24 24" data-vean-icon aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      />
    </svg>
    <svg v-else width="1.25em" height="1.25em" viewBox="0 0 24 24" data-vean-icon aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        />
      </g>
    </svg>
  </button>
</template>
