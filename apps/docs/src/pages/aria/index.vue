<script setup lang="ts">
definePage({ layout: 'default' });

// TODO(aria): placeholder until the aria docs land (D8).

const { t } = useI18n();
</script>

<template>
  <div class="mx-auto max-w-screen-2xl space-y-8 px-4 py-8 md:px-8 md:pt-12">
    <div class="space-y-4">
      <div
        class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        <SIcon icon="lucide:code-xml" class="text-sm text-primary" />
        <span>{{ t('layout.header.aria') }}</span>
      </div>
      <!-- Hero title stays a paragraph: the markdown below owns the page's only h1. -->
      <p class="text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.96] tracking-[-0.05em] text-foreground">
        {{ t('aria.catalog.title') }}
      </p>
    </div>
    <SAlert
      color="info"
      variant="soft"
      icon="lucide:construction"
      :title="t('aria.catalog.notice.title')"
      :description="t('aria.catalog.notice.description')"
    />

    <DocMd path="aria/index" />
  </div>
</template>
