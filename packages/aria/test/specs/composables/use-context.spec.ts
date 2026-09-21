import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { useContext } from '../../../src/composables/use-context';

describe('useContext', () => {
  it('provides and injects a plain context value', () => {
    const [provideContext, useConsumer] = useContext<{ value: string }>('PlainContext');

    const Provider = defineComponent({
      setup() {
        provideContext({ value: 'provided' });
        return { context: { value: 'provided' } };
      },
      template: '<slot />'
    });

    const Consumer = defineComponent({
      setup() {
        const context = useConsumer();
        return { context };
      },
      template: '<div>{{ context?.value }}</div>'
    });

    const wrapper = mount({
      components: { Provider, Consumer },
      template: '<Provider><Consumer /></Provider>'
    });
    expect(wrapper.text()).toBe('provided');
  });

  it('supports the composable variant and forwards arguments', () => {
    const [provideContext, useConsumer] = useContext('ComposableContext', (prefix: string) => ({
      label: `${prefix}-value`
    }));

    const Provider = defineComponent({
      setup(_, { slots }) {
        provideContext('test');
        return () => slots.default?.();
      }
    });

    const Consumer = defineComponent({
      setup() {
        const context = useConsumer();
        return () => `${context?.label ?? ''}`;
      }
    });

    const wrapper = mount({
      components: { Provider, Consumer },
      template: '<Provider><Consumer /></Provider>'
    });
    expect(wrapper.text()).toBe('test-value');
  });

  it('returns null when the context is missing and no consumer name is given', () => {
    const [, useConsumer] = useContext<{ value: string }>('MissingContext');

    const Consumer = defineComponent({
      setup() {
        const context = useConsumer();
        return { context };
      },
      template: '<div>{{ context === null ? "null" : "not-null" }}</div>'
    });

    expect(mount(Consumer).text()).toBe('null');
  });

  it('throws when a consumer name is given but the context is missing', () => {
    const [, useConsumer] = useContext<{ value: string }>('StrictContext');

    const Consumer = defineComponent({
      setup() {
        expect(() => useConsumer('MyConsumer')).toThrow('`MyConsumer` must be used within `StrictContext`');
        return () => '';
      }
    });

    mount(Consumer);
  });

  it('honors a default value when the context is missing', () => {
    const [, useConsumer] = useContext<{ value: string }>('DefaultedContext');

    const Consumer = defineComponent({
      setup() {
        const context = useConsumer(undefined, { value: 'fallback' });
        return { context };
      },
      template: '<div>{{ context.value }}</div>'
    });

    expect(mount(Consumer).text()).toBe('fallback');
  });

  it('uses the provided symbol key when the context name is an object', () => {
    const key = Symbol('KeyedContext');
    const [provideA, useConsumerA] = useContext<{ value: number }>({ name: 'KeyedContext', key });
    const [, useConsumerB] = useContext<{ value: number }>({ name: 'KeyedContext', key });

    const Provider = defineComponent({
      setup(_, { slots }) {
        provideA({ value: 7 });
        return () => slots.default?.();
      }
    });

    const Consumer = defineComponent({
      setup() {
        const value = useConsumerB()?.value ?? useConsumerA()?.value;
        return () => `${value ?? ''}`;
      }
    });

    const wrapper = mount({
      components: { Provider, Consumer },
      template: '<Provider><Consumer /></Provider>'
    });
    expect(wrapper.text()).toBe('7');
  });
});
