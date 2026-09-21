import { describe, expect, it, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { useControllableState } from '../../../../aria/src/composables/use-controllable-state';

describe('useControllableState', () => {
  it('should work in controlled mode', async () => {
    const onChange = vi.fn();
    const controlledValue = ref('initial');

    const state = useControllableState(() => controlledValue.value, onChange, 'default');

    expect(state.value).toBe('initial');

    // Change controlled value
    controlledValue.value = 'new value';
    await nextTick();
    expect(state.value).toBe('new value');

    // Set state value should call onChange
    state.value = 'changed';
    expect(onChange).toHaveBeenCalledWith('changed');
  });

  it('should work in uncontrolled mode', async () => {
    const onChange = vi.fn();

    const state = useControllableState(() => undefined as any, onChange, 'default');

    expect(state.value).toBe('default');

    // Change state value
    state.value = 'new value';
    await nextTick();
    expect(state.value).toBe('new value');
    expect(onChange).toHaveBeenCalledWith('new value');
  });

  it('should switch from uncontrolled to controlled', async () => {
    const onChange = vi.fn();
    const controlledValue = ref(undefined as any);

    const state = useControllableState(() => controlledValue.value, onChange, 'default');

    expect(state.value).toBe('default');

    // Switch to controlled
    controlledValue.value = 'controlled';
    await nextTick();
    expect(state.value).toBe('controlled');
  });

  it('should handle undefined onChange', () => {
    const controlledValue = ref('initial');

    const state = useControllableState(() => controlledValue.value, undefined, 'default');

    expect(state.value).toBe('initial');

    // Should not throw when setting value
    expect(() => {
      state.value = 'new value';
    }).not.toThrow();
  });

  it('should use default value when initial is undefined', () => {
    const onChange = vi.fn();

    const state = useControllableState(() => undefined as any, onChange, 'default value');

    expect(state.value).toBe('default value');
  });
});
