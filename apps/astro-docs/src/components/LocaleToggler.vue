<script setup lang="ts">
import { ref } from 'vue';

/**
 * Port of `apps/docs/src/components/locale-toggler.vue`.
 *
 * The ubean version is an `SDropdownMenuRadio` that swaps the locale through
 * `setLocale()` + `router.replace()` so the SPA does not reload. Astro has no
 * client router here, so the toggle is a plain link to the same page in the other
 * locale — a full navigation, which is what a static site does anyway.
 *
 * The href is resolved at build time by `ToolBar.astro` (`alternateLocalePath`), so
 * this island ships no route table.
 */
const props = defineProps<{
  locale: 'en' | 'zh';
  /** Same-origin URL of this page in the other locale. */
  alternatePath: string;
}>();

const open = ref(false);

const labels: Record<'en' | 'zh', string> = { en: 'English', zh: '中文' };
const other = props.locale === 'en' ? 'zh' : 'en';
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="inline-flex size-9 items-center justify-center rounded-md text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-accent-foreground/10"
      :aria-label="locale === 'zh' ? '语言' : 'Language'"
      :aria-expanded="open"
      @click="open = !open"
    >
      <svg width="1.25em" height="1.25em" viewBox="0 0 24 24" data-vean-icon aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="m5 8 6 6m-7 6 6.5-7L17 7m-3 14 4-9 4 9m-6.5-2h5" />
        </g>
      </svg>
    </button>

    <ul
      v-if="open"
      class="absolute end-0 z-50 mt-1 min-w-32 rounded-md border border-border bg-popover p-1 text-sm text-popover-foreground shadow-md"
      role="menu"
    >
      <li>
        <a
          :href="alternatePath"
          class="flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent"
          role="menuitem"
          :aria-current="locale === 'zh' ? 'true' : undefined"
        >
          <span>{{ labels[other] }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
