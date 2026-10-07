import { addComponent, defineNuxtModule } from 'nuxt/kit';
import type { NuxtModule } from 'nuxt/schema';
import { components } from '../constants';

export interface ModuleOptions {
  components: Partial<Record<keyof typeof components, boolean>> | boolean;
}

const nuxtModule: NuxtModule<ModuleOptions> = defineNuxtModule({
  meta: {
    name: '@soybeanjs/headless/nuxt',
    configKey: '@soybeanjs/headless',
    compatibility: {
      nuxt: '>=3.14'
    }
  },
  defaults: {
    components: true
  },
  setup(options: ModuleOptions) {
    function getComponents() {
      if (typeof options.components === 'object') {
        return Object.entries(components)
          .filter(([name]) => (options.components as Record<string, boolean>)[name])
          .flatMap(([_, _components]) => _components);
      }

      if (options.components) {
        return Object.values(components).flat();
      }

      return [];
    }

    for (const component of getComponents()) {
      addComponent({
        name: `${component}`,
        export: component,
        filePath: '@soybeanjs/headless'
      });
    }
  }
});

export default nuxtModule;
