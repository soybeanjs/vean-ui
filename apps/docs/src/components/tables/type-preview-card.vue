<script setup lang="ts">
import { computed, inject } from 'vue';
import { SLink } from '@vean/ui';
import CallableTypeTable from './callable-type-table.vue';
import type { GeneratedApiTypePreview } from './generated-api';
import { normalizeTypeRenderContext, provideTypeRenderContext, typeRenderContextKey } from './type-anchor';
import TypeData from './type-data.vue';
import TypePreviewCode from './type-preview-code.vue';
import { useApiI18n } from './use-api-i18n';

interface Props {
  href?: string | null;
  preview: GeneratedApiTypePreview;
}

const props = defineProps<Props>();

const { resolveApiText, t } = useApiI18n();

const parentTypeRenderContext = inject(
  typeRenderContextKey,
  computed(() => normalizeTypeRenderContext())
);

provideTypeRenderContext(() => {
  const normalizedParentContext = normalizeTypeRenderContext(parentTypeRenderContext.value);

  return {
    ...normalizedParentContext,
    activePreviewNames: [...normalizedParentContext.activePreviewNames, props.preview.name]
  };
});

const description = computed(() => resolveApiText(props.preview.description, props.preview.descriptionKey));
</script>

<template>
  <div data-vean-hover-card-sub-popup class="min-w-80 max-w-xl max-h-96 overflow-auto p-2 space-y-3">
    <p v-if="description" class="text-xs leading-5 text-muted-foreground">
      {{ description }}
    </p>

    <TypeData
      v-if="preview.kind === 'table'"
      :name="preview.name"
      :display-name="preview.displayName"
      :description="preview.description"
      :description-key="preview.descriptionKey"
      :fields="preview.fields"
      hide-header
    />

    <CallableTypeTable
      v-else-if="preview.kind === 'callable'"
      :name="preview.name"
      :display-name="preview.displayName"
      :description="preview.description"
      :description-key="preview.descriptionKey"
      :preset="preview.preset"
      :rows="preview.rows"
      hide-header
    />

    <TypePreviewCode v-else :code="preview.code || `type ${preview.displayName || preview.name} = ${preview.type}`" />

    <div v-if="href" class="border-t pt-2">
      <SLink :href="href" target="_self" class="text-xs text-primary hover:underline underline-offset-4">
        {{ t('api.actions.open_full_type') }}
      </SLink>
    </div>
  </div>
</template>
