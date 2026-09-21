/**
 * Vean project templates.
 *
 * Vite + Nuxt 3 — ready for vean components.
 *
 * Template file content may contain `{{variable}}` placeholders that are
 * resolved at scaffold time by {@link scaffoldFromTemplate}.
 *
 * Supported placeholders:
 *   - `{{projectName}}`    — the project name
 *   - `{{uiDir}}`          — the component output directory (e.g. "src/ui")
 *   - `{{resolverPath}}`   — relative import path for the Vean resolver
 *
 * @soybeanjs/* package versions are pinned to `{@link VEAN_VERSION}` and
 * kept in sync during release via `scripts/sync-template-versions.ts`.
 */

import { VEAN_VERSION } from './versions';

export type FrameworkType = 'vue-vite' | 'nuxt';

export interface ProjectTemplate {
  name: string;
  description: string;
  framework: FrameworkType;
  /** File path → content (may contain `{{variable}}` placeholders). */
  files: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

/** Variables that can be interpolated into template file content. */
export interface TemplateVariables {
  projectName: string;
  uiDir: string;
  resolverPath: string;
}

// ---------------------------------------------------------------------------
// Shared snippet: uno.config.ts (used by both templates)
// ---------------------------------------------------------------------------

const UNO_CONFIG_CONTENT = `import { defineConfig } from 'unocss'
import { presetVean } from '@vean/unocss'

export default defineConfig({
  presets: [presetVean()]
})
`;

// ---------------------------------------------------------------------------
// Shared snippet: vean.json (used by both templates)
// ---------------------------------------------------------------------------

const VEAN_JSON_CONTENT = `{
  "iconLibrary": "lucide",
  "uno": {
    "size": "md",
    "radius": "md",
    "base": "zinc",
    "primary": "indigo"
  },
  "font": {}
}
`;

// ---------------------------------------------------------------------------
// Vue 3 + Vite
// ---------------------------------------------------------------------------

export const vueViteTemplate: ProjectTemplate = {
  name: 'vue-vite',
  description: 'Vue 3 + Vite + UnoCSS',
  framework: 'vue-vite',
  files: {
    'vite.config.ts': `import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import UiResolver from '{{resolverPath}}'

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  plugins: [
    Vue(),
    UnoCSS(),
    Components({
      dts: fileURLToPath(new URL('./src/typings/components.d.ts', import.meta.url)),
      resolvers: [UiResolver()]
    })
  ]
})
`,
    'uno.config.ts': UNO_CONFIG_CONTENT,
    'tsconfig.json': `{
  "compilerOptions": {
    "target": "ESNext",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "lib": ["DOM", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "paths": {
      "#ui/*": ["./{{uiDir}}/*"]
    },
    "types": ["node", "vite/client"],
    "resolveJsonModule": true,
    "strict": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true
  },
  "include": ["./**/*.ts", "./**/*.d.ts", "./**/*.tsx", "./**/*.vue"],
  "exclude": ["node_modules", "dist", "src/typings"]
}
`,
    'vean.json': VEAN_JSON_CONTENT,
    'src/main.ts': `import { createApp } from 'vue'
import 'uno.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
`,
    'src/App.vue': `<script setup lang="ts"></script>

<template>
  <SConfigProvider>
    <div>
      <h1>Welcome to Vean</h1>
      <p>Run <code>vean add &lt;component&gt;</code> to add components.</p>
      <SButton>Vean</SButton>
    </div>
  </SConfigProvider>
</template>
`,
    'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
  },
  scripts: {
    dev: 'vp dev',
    build: 'vp build',
    preview: 'vp preview'
  },
  dependencies: {
    '@iconify/vue': '^5.0.1',
    '@soybeanjs/cva': `^0.0.9`,
    '@vean/aria': `^${VEAN_VERSION}`,
    '@soybeanjs/hooks': `^0.3.0`,
    '@vean/theme': `^${VEAN_VERSION}`,
    vue: '^3.5.41',
    'vue-router': '^5.2.0'
  },
  devDependencies: {
    '@vean/unocss': `^${VEAN_VERSION}`,
    '@vitejs/plugin-vue': '^6.0.7',
    typescript: '^6.0.3',
    unocss: '^66.7.2',
    'unplugin-vue-components': '^32.1.0',
    'vite-plus': '^0.2.8',
    'vue-tsc': '^3.3.5'
  }
};

// ---------------------------------------------------------------------------
// Nuxt 3
// ---------------------------------------------------------------------------

export const nuxtTemplate: ProjectTemplate = {
  name: 'nuxt',
  description: 'Nuxt 3 + UnoCSS',
  framework: 'nuxt',
  files: {
    'nuxt.config.ts': `import UiModule from './{{uiDir}}/nuxt'

export default defineNuxtConfig({
  modules: ['@unocss/nuxt', UiModule],
  compatibilityDate: '2026-01-01',
  alias: {
    '#ui': './{{uiDir}}'
  }
})
`,
    'uno.config.ts': UNO_CONFIG_CONTENT,
    'tsconfig.json': `{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "paths": {
      "#ui/*": ["./{{uiDir}}/*"]
    }
  }
}
`,
    'vean.json': VEAN_JSON_CONTENT,
    'app.vue': `<template>
  <div>
    <NuxtPage />
  </div>
</template>
`,
    'pages/index.vue': `<script setup lang="ts"></script>

<template>
  <SConfigProvider>
    <div>
      <h1>Welcome to Vean + Nuxt</h1>
      <p>Run <code>vean add &lt;component&gt;</code> to add components.</p>
      <SButton>Vean</SButton>
    </div>
  </SConfigProvider>
</template>
`
  },
  dependencies: {
    '@iconify/vue': '^5.0.1',
    '@soybeanjs/cva': `^0.0.9`,
    '@vean/aria': `^${VEAN_VERSION}`,
    '@soybeanjs/hooks': `^0.3.0`,
    '@vean/theme': `^${VEAN_VERSION}`,
    nuxt: '^4.4.8'
  },
  devDependencies: {
    '@unocss/nuxt': '^66.7.2',
    unocss: '^66.7.2'
  },
  scripts: {
    dev: 'nuxt dev',
    build: 'nuxt build',
    generate: 'nuxt generate',
    preview: 'nuxt preview'
  }
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const TEMPLATES: Record<FrameworkType, ProjectTemplate> = {
  'vue-vite': vueViteTemplate,
  nuxt: nuxtTemplate
};

export function getTemplate(name: FrameworkType): ProjectTemplate | null {
  return TEMPLATES[name] ?? null;
}

export function listTemplates(): Array<{
  name: string;
  description: string;
  framework: FrameworkType;
}> {
  return Object.values(TEMPLATES).map(t => ({
    name: t.name,
    description: t.description,
    framework: t.framework
  }));
}
