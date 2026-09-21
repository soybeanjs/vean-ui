<script setup lang="ts">
import { computed } from 'vue';
import { SCard, SKbd } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewFont'
});

/** the engine's `LITERAL_DEFAULTS` stacks, used when the theme layer is absent. */
const FALLBACKS: Record<string, string> = {
  'font-sans':
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  'font-heading':
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  'font-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  'font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
};

/** the four typography tokens, in shadcn's order: three root roles + heading. */
const TOKENS = ['font-sans', 'font-serif', 'font-mono', 'font-heading'] as const;

/** Read the live `--font-*` literal from `:root` (falls back to the engine system stack). */
const readFontVar = (name: string): string => {
  if (typeof window === 'undefined') {
    return FALLBACKS[name];
  }

  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  return value || FALLBACKS[name];
};

const stacks = computed(() => TOKENS.map(token => ({ token, stack: readFontVar(token) })));

const code = `:root {\n  --font-sans: …;\n  --font-serif: …;\n  --font-mono: …;\n  --font-heading: …;\n}`;
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">Live stacks — read from `--font-*` on `:root`</p>
      <div class="space-y-2">
        <div
          v-for="item in stacks"
          :key="item.token"
          class="flex flex-col gap-1 rounded-lg border border-border bg-card px-3 py-2 sm:flex-row sm:items-start sm:gap-4"
        >
          <span class="w-28 shrink-0 font-mono text-2xs text-muted-foreground">{{ item.token }}</span>
          <code class="min-w-0 flex-1 break-all font-mono text-2xs text-foreground/80">{{ item.stack }}</code>
        </div>
      </div>
    </div>

    <div class="grid gap-4 xl:grid-cols-2">
      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">font-sans — body &amp; controls</p>
        <SCard title="Body copy" description="The sans stack drives paragraphs, labels and form chrome" class="p-0">
          <div class="space-y-2 text-sm text-foreground">
            <p class="font-sans">
              Pack my box with five dozen liquor jugs — the default reading face for UI copy, tables and long-form
              documentation.
            </p>
            <div class="flex flex-wrap items-center gap-2">
              <SKbd :value="['ctrl', 'K']" />
              <span class="font-sans text-xs text-muted-foreground">Shortcuts and hints inherit the sans stack</span>
            </div>
          </div>
        </SCard>
      </div>

      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">font-heading — titles</p>
        <SCard title="Section heading" description="Headings and display text use --font-heading" class="p-0">
          <div class="space-y-1">
            <p class="font-heading text-xl font-semibold text-foreground">SoybeanUI Theme Engine</p>
            <p class="font-heading text-sm text-muted-foreground">
              One stack for titles — swap it from the customizer and every heading follows.
            </p>
          </div>
        </SCard>
      </div>

      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">font-serif — serif copy</p>
        <SCard
          title="Long-form reading"
          description="Prose that opts into the serif stack reads --font-serif"
          class="p-0"
        >
          <div class="space-y-2">
            <p class="font-serif text-sm text-foreground">
              The serif role is a root variable of its own, so body copy can go serif while the heading stays sans — or
              the reverse, independently.
            </p>
            <p class="font-serif text-sm italic text-muted-foreground">
              Set apart from the sans arm, and no longer folded into the heading role.
            </p>
          </div>
        </SCard>
      </div>
    </div>

    <div class="space-y-2">
      <p class="text-xs text-muted-foreground">font-mono — code &amp; tokens</p>
      <SCard title="Inline code" description="Code, kbd and token chips read --font-mono" class="p-0">
        <div class="space-y-2">
          <p class="text-sm text-foreground">
            <span>Resolve</span>
            <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">resolveThemeMap()</code>
            <span>and emit</span>
            <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">--font-sans</code>
            <span>from the literal layer.</span>
          </p>
          <pre class="overflow-x-auto rounded-lg bg-muted px-3 py-2 font-mono text-2xs text-foreground">
            {{ code }}
          </pre>
        </div>
      </SCard>
    </div>
  </div>
</template>
