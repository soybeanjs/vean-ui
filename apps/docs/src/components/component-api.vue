<script setup lang="ts">
import { computed } from 'vue';
import { getComponentApiSections } from './tables/generated-api';
import { provideTypeRenderContext, typeToVNode } from './tables/type-anchor';

interface Props {
  component: string;
}

const props = defineProps<Props>();

const { t } = useI18n();

const apiLayers = computed(() => getComponentApiSections(props.component));

provideTypeRenderContext(() => ({
  component: props.component,
  activePreviewNames: []
}));

const layerTitleMap: Record<string, string> = {
  ui: 'api.ui_layer',
  aria: 'api.aria_layer',
  chart: 'api.chart_layer',
  admin: 'api.admin_layer'
};
</script>

<template>
  <div class="space-y-8">
    <section v-for="layer in apiLayers" :key="layer.key" class="space-y-5">
      <div class="flex flex-wrap items-center gap-3 border-b border-border/60 pb-4">
        <h3 class="scroll-mt-24 text-2xl font-bold tracking-[-0.03em] text-foreground">
          {{ t(layerTitleMap[layer.key]) }}
        </h3>
        <span class="text-sm font-medium text-muted-foreground">{{ layer.symbols.length }}</span>
      </div>

      <SCard v-for="symbol in layer.symbols" :key="symbol.key" split class="docs-card overflow-hidden">
        <template #title>
          <h4 class="scroll-mt-24 text-lg font-semibold tracking-[-0.02em] text-foreground">
            <component :is="typeToVNode(symbol.displayName)" />
          </h4>
        </template>

        <template #extra>
          <div
            class="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
          >
            <span v-if="symbol.propsRows.length">{{ symbol.propsRows.length }} {{ t('api.props') }}</span>
            <span v-if="symbol.emitsRows.length">{{ symbol.emitsRows.length }} {{ t('api.emits') }}</span>
            <span v-if="symbol.slotsRows.length">{{ symbol.slotsRows.length }} {{ t('api.slots') }}</span>
          </div>
        </template>

        <template #default>
          <div class="space-y-5">
            <div v-if="symbol.propsRows.length" class="space-y-3">
              <h5 class="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {{ t('api.props') }}
              </h5>
              <DataTable preset="props" :data="symbol.propsRows" />
            </div>

            <div v-if="symbol.emitsRows.length" class="space-y-3">
              <h5 class="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {{ t('api.emits') }}
              </h5>
              <DataTable preset="emits" :data="symbol.emitsRows" />
            </div>

            <div v-if="symbol.slotsRows.length" class="space-y-3">
              <h5 class="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {{ t('api.slots') }}
              </h5>
              <DataTable preset="slots" :data="symbol.slotsRows" />
            </div>
          </div>
        </template>
      </SCard>
    </section>
  </div>
</template>
