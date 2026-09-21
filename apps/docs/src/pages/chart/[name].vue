<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { kebabCase, pascalCase } from '@vean/aria/shared';
import PlaygroundGallery from '~/components/playground-gallery.vue';
import { chartMenuData } from '~/constants/menus';

definePage({ layout: 'default' });

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const name = computed(() => kebabCase(String((route.params as Record<string, string | string[]>).name ?? '')));

const chartNames = computed(() => chartMenuData.flatMap(group => group.items.map(kebabCase)));

const isValid = computed(() => chartNames.value.includes(name.value));

const title = computed(() => pascalCase(name.value));
const description = computed(() => t(`chart.kinds.${name.value}`, ''));

const relatedKinds = computed(() => chartNames.value.filter(item => item !== name.value));

// Unknown chart type → 404, mirroring the component detail pages.
if (!isValid.value) {
  router.replace('/404');
}
</script>

<template>
  <div class="mx-auto max-w-screen-2xl space-y-6 pb-8">
    <section
      class="relative overflow-hidden px-6 py-7 border border-border/50 dark:border-border rounded-xl sm:px-8 sm:py-9 xl:px-10"
    >
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary-400)/0.12),transparent_30%),radial-gradient(circle_at_bottom_left,hsl(var(--primary-700)/0.07),transparent_28%)]"
      />

      <div class="relative space-y-5">
        <SButtonLink to="/chart" size="sm" variant="ghost" color="accent" class="group -ml-2">
          <SIcon icon="lucide:arrow-left" class="transition-transform duration-200 group-hover:-translate-x-1" />
          {{ t('component_detail.actions.catalog') }}
        </SButtonLink>

        <div
          class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          <SIcon icon="lucide:bar-chart-3" class="text-sm text-primary" />
          <span>{{ t('layout.header.chart') }}</span>
        </div>

        <div class="space-y-3">
          <p class="text-3xl font-black tracking-[-0.05em] text-foreground">
            {{ title }}
          </p>
          <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {{ description }}
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <SButtonLink v-for="item in relatedKinds" :key="item" :to="`/chart/${item}`" shape="rounded" variant="pure">
            {{ pascalCase(item) }}
          </SButtonLink>
        </div>
      </div>
    </section>

    <PlaygroundGallery v-if="isValid" :component="name" />
  </div>
</template>
