import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { useForwardListeners } from '../../../../aria/src/composables/use-forward-listeners';

describe('useForwardListeners', () => {
  it('should return empty object when no emits are defined', () => {
    const mockEmit = vi.fn();

    const TestComponent = defineComponent({
      setup() {
        const listeners = useForwardListeners(mockEmit);
        return { listeners };
      },
      template: '<div>Test</div>'
    });

    const wrapper = mount(TestComponent);
    const componentInstance = wrapper.vm as any;

    expect(componentInstance.listeners).toEqual({});
  });

  it('should create listeners for defined emits', () => {
    const TestComponent = defineComponent({
      emits: ['click', 'change', 'input'],
      setup(_, { emit }) {
        const listeners = useForwardListeners<'click' | 'change' | 'input'>(emit);
        return { listeners };
      },
      template: '<div>Test</div>'
    });

    const wrapper = mount(TestComponent);
    const componentInstance = wrapper.vm as any;

    expect(typeof componentInstance.listeners.click).toBe('function');
    expect(typeof componentInstance.listeners.change).toBe('function');
    expect(typeof componentInstance.listeners.input).toBe('function');
  });

  it('should forward events with arguments', () => {
    const mockEmit = vi.fn();

    const TestComponent = defineComponent({
      emits: ['click', 'change'],
      setup() {
        const listeners = useForwardListeners<'click' | 'change'>(mockEmit);

        // Simulate calling the listeners
        listeners.click('arg1', 'arg2');
        listeners.change('value');

        return { listeners };
      },
      template: '<div>Test</div>'
    });

    mount(TestComponent);

    expect(mockEmit).toHaveBeenCalledWith('click', 'arg1', 'arg2');
    expect(mockEmit).toHaveBeenCalledWith('change', 'value');
    expect(mockEmit).toHaveBeenCalledTimes(2);
  });

  it('should handle case when used outside component context', () => {
    const mockEmit = vi.fn();

    // This should not throw when called outside of component context
    expect(() => {
      const listeners = useForwardListeners(mockEmit);
      expect(listeners).toEqual({});
    }).not.toThrow();
  });

  it('should work with different event types', () => {
    const mockEmit = vi.fn();

    const TestComponent = defineComponent({
      emits: ['update:modelValue', 'focus', 'blur'],
      setup() {
        const listeners = useForwardListeners<'update:modelValue' | 'focus' | 'blur'>(mockEmit);

        // Test different event patterns
        listeners['update:modelValue']('new value');
        listeners.focus();
        listeners.blur();

        return { listeners };
      },
      template: '<div>Test</div>'
    });

    mount(TestComponent);

    expect(mockEmit).toHaveBeenCalledWith('update:modelValue', 'new value');
    expect(mockEmit).toHaveBeenCalledWith('focus');
    expect(mockEmit).toHaveBeenCalledWith('blur');
    expect(mockEmit).toHaveBeenCalledTimes(3);
  });
});
