import { describe, expect, it } from 'vitest';
import { computed, reactive, ref, shallowReadonly } from 'vue';
import { withSetup } from '../../shared';
import { provideConfigProviderContext, useDirection } from '../../../../aria/src/components/config-provider/context';

describe('useDirection', () => {
  it('should return ltr as default direction', () => {
    const [direction, unmount] = withSetup(() => useDirection());
    expect(direction.value).toBe('ltr');
    unmount();
  });

  it('should use provided direction', () => {
    const [direction, unmount] = withSetup(() => useDirection('rtl'));
    expect(direction.value).toBe('rtl');
    unmount();
  });

  it('should use reactive direction', () => {
    const dir = ref<'ltr' | 'rtl'>('ltr');
    const [direction, unmount] = withSetup(() => useDirection(dir));

    expect(direction.value).toBe('ltr');

    dir.value = 'rtl';
    expect(direction.value).toBe('rtl');
    unmount();
  });

  it('should use computed direction', () => {
    const isRtl = ref(false);
    const computedDir = computed(() => (isRtl.value ? 'rtl' : 'ltr'));
    const [direction, unmount] = withSetup(() => useDirection(computedDir));

    expect(direction.value).toBe('ltr');

    isRtl.value = true;
    expect(direction.value).toBe('rtl');
    unmount();
  });

  it('should use getter function direction', () => {
    const currentDir = ref<'ltr' | 'rtl'>('ltr');
    const [direction, unmount] = withSetup(() => useDirection(() => currentDir.value));

    expect(direction.value).toBe('ltr');

    currentDir.value = 'rtl';
    expect(direction.value).toBe('rtl');
    unmount();
  });

  it('should fallback to context direction when no dir provided', () => {
    const contextProps = reactive<{ dir?: 'ltr' | 'rtl' }>({ dir: 'rtl' });
    const [direction, unmount] = withSetup(
      () => useDirection(),
      () => provideConfigProviderContext(shallowReadonly(contextProps))
    );

    expect(direction.value).toBe('rtl');

    contextProps.dir = 'ltr';
    expect(direction.value).toBe('ltr');
    unmount();
  });

  it('should prefer provided direction over context', () => {
    const contextProps = reactive<{ dir?: 'ltr' | 'rtl' }>({ dir: 'rtl' });
    const [direction, unmount] = withSetup(
      () => useDirection('ltr'),
      () => provideConfigProviderContext(shallowReadonly(contextProps))
    );

    expect(direction.value).toBe('ltr');
    unmount();
  });

  it('should fallback to context when provided direction is undefined', () => {
    const contextProps = reactive<{ dir?: 'ltr' | 'rtl' }>({ dir: 'rtl' });
    const dir = ref<'ltr' | 'rtl' | undefined>(undefined);
    const [direction, unmount] = withSetup(
      () => useDirection(dir),
      () => provideConfigProviderContext(shallowReadonly(contextProps))
    );

    expect(direction.value).toBe('rtl');

    contextProps.dir = 'ltr';
    expect(direction.value).toBe('ltr');
    unmount();
  });

  it('should fallback to ltr when both provided and context are undefined', () => {
    const dir = ref<'ltr' | 'rtl' | undefined>(undefined);
    const [direction, unmount] = withSetup(() => useDirection(dir));
    expect(direction.value).toBe('ltr');
    unmount();
  });
});
