import { addComponent, defineNuxtModule } from '@nuxt/kit';
import type { NuxtModule } from '@nuxt/schema';
//---import { keysOf, kebabCase } from '@vean/aria/shared';
import { components } from '../constants/components';

export interface ModuleOptions {
  components: Partial<Record<keyof typeof components, boolean>> | boolean;
}

const nuxtModule: NuxtModule<ModuleOptions> = defineNuxtModule({
  meta: {
    name: '@vean/ui/nuxt',
    configKey: '@vean/ui',
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
      //---const path = kebabCase(keysOf(components).find(key => components[key]?.includes(component))!);

      addComponent({
        name: `${component}`,
        export: component,
        filePath: '@vean/ui'
      });
    }
  }
});

export default nuxtModule;
