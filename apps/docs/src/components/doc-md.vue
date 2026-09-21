<script setup lang="ts">
import { nextTick, onBeforeUnmount, onServerPrefetch, shallowRef, watchEffect } from 'vue';
import type { Component } from 'vue';
import { ClientOnly } from 'ubean/client';
import type { AnchorOptionData } from '@vean/aria/anchor';
import { useDocOutline } from '~/composables/use-doc-outline';
import { toHeadingId } from '~/shared/heading';

interface Props {
  /**
   * The path to the markdown file, relative to `src/content/{locale}/`
   *
   * @example 'ui/components/button', 'ui/quick-start', 'cli/index'
   */
  path: string;
}

const props = defineProps<Props>();

interface Emits {
  /**
   * Emitted when the markdown file is loaded
   * The parameter indicates whether the loading was successful
   */
  loaded: [isSuccess: boolean];
}

const emit = defineEmits<Emits>();

const { locale } = useI18n();

const docOutline = useDocOutline();

const mdModules = import.meta.glob<{ default: Component }>('./**/*.md', { base: '/src/content' });

const cp = shallowRef<Component | null>(null);
const contentRef = shallowRef<HTMLElement | null>(null);
let loadVersion = 0;

async function loadDoc() {
  loadVersion += 1;
  const currentLoadVersion = loadVersion;

  let path = props.path;
  if (path.startsWith('/')) {
    path = path.slice(1);
  }
  if (path.endsWith('.md')) {
    path = path.slice(0, -3);
  }

  const key = `./${locale.value}/${path}.md`;
  const load = mdModules[key];

  let isSuccess = false;

  docOutline.value = [];

  if (load) {
    const mod = await load();

    if (currentLoadVersion !== loadVersion) {
      return;
    }

    cp.value = mod.default;
    isSuccess = true;

    await nextTick();
    updateDocOutline();
  } else {
    cp.value = null;
  }

  emit('loaded', isSuccess);
}

function updateDocOutline() {
  const container = contentRef.value;

  if (!container) {
    docOutline.value = [];
    return;
  }

  const headings = Array.from(
    container.querySelectorAll<HTMLElement>('.markdown-wrapper h2, .markdown-wrapper h3, .markdown-wrapper h4')
  );

  if (!headings.length) {
    docOutline.value = [];
    return;
  }

  const usedIds = new Set(
    Array.from(container.querySelectorAll<HTMLElement>('[id]'))
      .map(element => element.id)
      .filter(Boolean)
  );
  const idCounter = new Map<string, number>();

  const nodes = headings.map(heading => {
    const level = Number.parseInt(heading.tagName.slice(1), 10);
    const title = heading.textContent?.trim() ?? '';

    if (!heading.id) {
      const baseId = toHeadingId(title);
      const currentCount = idCounter.get(baseId) ?? 0;
      let nextCount = currentCount;
      let candidateId = '';

      do {
        nextCount += 1;
        candidateId = nextCount > 1 ? `${baseId}-${nextCount}` : baseId;
      } while (usedIds.has(candidateId));

      idCounter.set(baseId, nextCount);
      heading.id = candidateId;
      usedIds.add(candidateId);
    }

    return {
      level,
      item: {
        href: `#${heading.id}`,
        title
      } satisfies AnchorOptionData
    };
  });

  docOutline.value = buildAnchorItems(nodes);
}

function buildAnchorItems(nodes: Array<{ level: number; item: AnchorOptionData }>) {
  const root: AnchorOptionData[] = [];
  const stack: Array<{ level: number; item: AnchorOptionData }> = [];

  for (const node of nodes) {
    while (stack.length && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1]?.item;

    if (parent) {
      parent.children ??= [];
      parent.children.push(node.item);
    } else {
      root.push(node.item);
    }

    stack.push(node);
  }

  return root;
}

onBeforeUnmount(() => {
  docOutline.value = [];
});

// SSR (ubean SSG): the renderer only awaits `onServerPrefetch`, so the async glob
// load must be hoisted here or the article renders empty in the prerendered HTML.
onServerPrefetch(() => loadDoc());

watchEffect(() => {
  loadDoc();
});
</script>

<template>
  <div ref="contentRef" class="min-w-0">
    <ClientOnly>
      <article
        v-if="cp"
        :data-doc-path="path"
        class="relative min-w-0 border border-border/50 dark:border-border rounded-xl overflow-hidden"
      >
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-r from-primary/8 via-warning/6 to-info/8 opacity-80"
        />
        <div class="relative min-w-0 px-5 py-6 sm:px-8 sm:py-8 xl:px-10 xl:py-10">
          <div class="min-w-0">
            <component :is="cp" />
          </div>
        </div>
      </article>
    </ClientOnly>
  </div>
</template>
