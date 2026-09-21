import type { ComponentResolver } from 'unplugin-vue-components';
import { components } from '../constants';
import { keysOf, kebabCase, pascalCase } from '../shared';

export interface ResolverOptions {
  /**
   * Whether to use standalone components
   *
   * "true" means use `import { AccordionRoot } from '@vean/aria/accordion'`
   *
   * "false" means use `import { AccordionRoot } from '@vean/aria'`
   *
   * @defaultValue false
   */
  standalone?: boolean;
}

function createResolver(options: ResolverOptions = {}) {
  const map = new Map<string, string>();
  keysOf(components).forEach(key => {
    components[key].forEach(component => {
      map.set(component, key);
    });
  });

  const resolver: ComponentResolver = {
    type: 'component',
    resolve: (id: string) => {
      const name = pascalCase(id);

      const value = map.get(name);

      if (!value) {
        return null;
      }

      const path = kebabCase(value);

      return {
        name,
        from: options.standalone ? `@vean/aria/${path}` : `@vean/aria`
      };
    }
  };

  return resolver;
}

export default createResolver;
