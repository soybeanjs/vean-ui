import { describe, expect, it } from 'vitest';
import { defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useContext } from '../../../../aria/src/composables/use-context';

describe('useContext', () => {
  it('should provide and inject context value', () => {
    const testComposable = (initialValue: string) => {
      const value = ref(initialValue);
      return { value };
    };

    const [useProvide, useInject] = useContext('TestContext', testComposable);

    const Provider = defineComponent({
      setup() {
        const context = useProvide('initial value');
        return { context };
      },
      template: '<slot :context="context" />'
    });

    const Consumer = defineComponent({
      setup() {
        const context = useInject();
        return { context };
      },
      template: '<div>{{ context?.value }}</div>'
    });

    const App = defineComponent({
      components: { Provider, Consumer },
      template: '<Provider><Consumer /></Provider>'
    });

    const wrapper = mount(App);
    expect(wrapper.text()).toBe('initial value');
  });

  it('should return null when context is not provided', () => {
    const testComposable = (initialValue: string) => {
      const value = ref(initialValue);
      return { value };
    };

    const [, useInject] = useContext('TestContext', testComposable);

    const Consumer = defineComponent({
      setup() {
        const context = useInject();
        return { context };
      },
      template: '<div>{{ context === null ? "null" : "not null" }}</div>'
    });

    const wrapper = mount(Consumer);
    expect(wrapper.text()).toBe('null');
  });

  it('should use default value when provided', () => {
    const testComposable = (initialValue: string) => {
      const value = ref(initialValue);
      return { value };
    };

    const [, useInject] = useContext('TestContext', testComposable);
    const defaultValue = { value: ref('default') };

    const Consumer = defineComponent({
      setup() {
        const context = useInject(undefined, defaultValue);
        return { context };
      },
      template: '<div>{{ context.value }}</div>'
    });

    const wrapper = mount(Consumer);
    expect(wrapper.text()).toBe('default');
  });

  it('should throw error when consumer name is provided but context not found', () => {
    const testComposable = (initialValue: string) => {
      const value = ref(initialValue);
      return { value };
    };

    const [, useInject] = useContext('TestContext', testComposable);

    const Consumer = defineComponent({
      setup() {
        expect(() => {
          useInject('TestConsumer');
        }).toThrow('`TestConsumer` must be used within `TestContext`');

        return {};
      },
      template: '<div>test</div>'
    });

    mount(Consumer);
  });

  it('should not throw when consumer name is null or undefined', () => {
    const testComposable = (initialValue: string) => {
      const value = ref(initialValue);
      return { value };
    };

    const [, useInject] = useContext('TestContext', testComposable);

    const Consumer = defineComponent({
      setup() {
        expect(() => {
          useInject(null);
          useInject(undefined);
        }).not.toThrow();

        return {};
      },
      template: '<div>test</div>'
    });

    mount(Consumer);
  });

  it('should pass arguments to composable function', () => {
    const testComposable = (arg1: string, arg2: number) => {
      const value = ref(`${arg1}-${arg2}`);
      return { value };
    };

    const [useProvide, useInject] = useContext('TestContext', testComposable);

    const Provider = defineComponent({
      setup() {
        const context = useProvide('test', 42);
        return { context };
      },
      template: '<slot :context="context" />'
    });

    const Consumer = defineComponent({
      setup() {
        const context = useInject();
        return { context };
      },
      template: '<div>{{ context?.value }}</div>'
    });

    const App = defineComponent({
      components: { Provider, Consumer },
      template: '<Provider><Consumer /></Provider>'
    });

    const wrapper = mount(App);
    expect(wrapper.text()).toBe('test-42');
  });
});
