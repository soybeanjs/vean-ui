<script setup lang="ts">
import { ref } from 'vue';
import { readTheme, writeTheme, type ThemeMode } from '../theme-client';

/**
 * Port of `apps/docs/src/components/theme-configurator.vue`.
 *
 * The ubean version opens an `@vean/ui` `SThemeCustomizer` popover (the full
 * token/font editor). Reproducing that editor is out of scope for a rendering
 * comparison and would drag the whole theming runtime into the client bundle, so
 * this island exposes the same **persisted state** — the `__VEAN_THEME` envelope —
 * through a light/dark/auto menu. The report calls out that the customizer UI
 * itself is not ported.
 *
 * The Google Fonts stylesheet is not requested at all here: the font picker is the
 * only consumer in the ubean site (`shared/fonts.ts`), so an unported picker means
 * no render-blocking font CSS on the Astro side.
 */
const props = defineProps<{ locale: 'en' | 'zh' }>();

const modes: ThemeMode[] = ['light', 'dark', 'auto'];
const open = ref(false);
const current = ref<ThemeMode>(readTheme().mode);

const copy: Record<'en' | 'zh', Record<ThemeMode, string>> = {
  en: { light: 'Light', dark: 'Dark', auto: 'System' },
  zh: { light: '浅色', dark: '深色', auto: '跟随系统' }
};

const label = props.locale === 'zh' ? '主题配置' : 'Theme configurator';

function select(mode: ThemeMode): void {
  current.value = mode;
  writeTheme({ ...readTheme(), mode });
  open.value = false;
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="inline-flex size-9 items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-accent-foreground/10"
      :aria-label="label"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" data-vean-icon aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" />
          <path d="M12 2v20" />
        </g>
      </svg>
    </button>

    <ul
      v-if="open"
      class="absolute end-0 z-50 mt-1 min-w-36 rounded-md border border-border bg-popover p-1 text-sm text-popover-foreground shadow-md"
      role="menu"
    >
      <li v-for="mode in modes" :key="mode">
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-start hover:bg-accent"
          role="menuitemradio"
          :aria-checked="current === mode"
          @click="select(mode)"
        >
          <span>{{ copy[locale][mode] }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>
