import { describe, expect, it } from 'vitest';
import { computed, reactive, ref, shallowRef } from 'vue';
import { fromContext, toContext } from '../../../src/shared/vue';

describe('shared/vue', () => {
  describe('toContext', () => {
    it('reactive source: keys default to all own keys and values stay live', () => {
      const source = reactive({ delay: 150, disabled: false });
      const context = toContext(source);

      expect(context.delay.value).toBe(150);
      expect(context.disabled.value).toBe(false);

      source.delay = 300;
      expect(context.delay.value).toBe(300);
    });

    it('reactive source: function values pass through uninvoked', () => {
      const source = reactive({ label: () => 'raw' });
      const context = toContext(source);

      expect(typeof context.label.value).toBe('function');
      expect((context.label.value as () => string)()).toBe('raw');
    });

    it('reactive source: explicit keys keep only the selected subset', () => {
      const source = reactive({ a: 1, b: 2 });
      const context = toContext(source, ['b']);

      expect(Object.keys(context)).toEqual(['b']);
      expect(context.b.value).toBe(2);
    });

    it('reactive source: empty keys produce an empty context', () => {
      expect(Object.keys(toContext(reactive({ a: 1 }), []))).toEqual([]);
    });

    it('computed source: values are live and taken as-is (functions not invoked)', () => {
      const count = ref(1);
      const config = computed(() => ({ delay: count.value * 2, format: () => 'raw' }));
      const context = toContext(config);

      expect(context.delay.value).toBe(2);
      count.value = 5;
      expect(context.delay.value).toBe(10);

      expect(typeof context.format.value).toBe('function');
      expect((context.format.value as () => string)()).toBe('raw');
    });

    it('getter source: re-evaluated on every read', () => {
      const count = ref(1);
      const context = toContext(() => ({ delay: count.value }));

      expect(context.delay.value).toBe(1);
      count.value = 3;
      expect(context.delay.value).toBe(3);
    });

    it('accepts a shallowRef source', () => {
      const source = shallowRef({ a: 1 });
      const context = toContext(source);

      expect(context.a.value).toBe(1);
      source.value = { a: 2 };
      expect(context.a.value).toBe(2);
    });

    it('does not mutate the source', () => {
      const source = reactive({ a: 1, b: 2 });
      toContext(source, ['a']);

      expect(source).toEqual({ a: 1, b: 2 });
    });
  });

  describe('fromContext', () => {
    it('snapshots context values into a plain object', () => {
      const context = toContext(reactive({ a: 1, b: true }));

      expect(fromContext(context)).toEqual({ a: 1, b: true });
    });

    it('is a per-call snapshot, not a live view', () => {
      const source = reactive({ a: 1 });
      const context = toContext(source);
      const snapshot = fromContext(context);

      source.a = 2;
      expect(snapshot.a).toBe(1);
      expect(fromContext(context)).toEqual({ a: 2 });
    });

    it('keys subset keeps only the selected entries', () => {
      const context = toContext(reactive({ a: 1, b: 2 }));

      expect(fromContext(context, ['b'])).toEqual({ b: 2 });
    });

    it('nullish context yields an empty object', () => {
      expect(fromContext(null)).toEqual({});
      expect(fromContext(undefined)).toEqual({});
    });
  });
});
