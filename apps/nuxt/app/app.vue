<script setup lang="ts">
import { SButton, SCard, SConfigProvider } from '@vean/ui';
import { provideThemeContext } from './theme';

// dir / locale 由本 app 的 UiPageContext 提供，主题状态由库内 SConfigProvider
// 管理，只需传入环境参数（isServer）即可。主题持久化走 localStorage，首帧
// 由 createThemeInitScript 内联脚本应用，无需 cookie。
const { configProviderProps } = provideThemeContext();
const isServer = import.meta.server;
</script>

<template>
  <SConfigProvider v-bind="configProviderProps" :is-server="isServer">
    <div class="mx-auto max-w-2xl p-8">
      <SCard title="Vean · Nuxt fixture" split>
        <template #default>
          <p class="text-sm text-muted-foreground">
            Minimal Nuxt integration fixture: verifies the
            <code>@vean/ui/nuxt</code>
            module (auto-import of S-prefixed components), UnoCSS wiring, and the theme / i18n context.
          </p>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <SButton>Nuxt</SButton>
            <SButton variant="outline">Vue</SButton>
            <SButton variant="ghost">UnoCSS</SButton>
          </div>
        </template>
      </SCard>
    </div>
    <DemoPresetButton />
  </SConfigProvider>
</template>
