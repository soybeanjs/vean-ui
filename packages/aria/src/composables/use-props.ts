import { computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { omit, pick } from '../shared';

export function usePickProps<T extends object, K extends keyof T>(
  props: T,
  keys: K[],
  ...extraProps: MaybeRefOrGetter<object>[]
) {
  return computed(() => ({ ...pick(props, keys), ...mergeExtraProps(...extraProps) }));
}

export function useOmitProps<T extends object, K extends keyof T>(
  props: T,
  keys: K[],
  ...extraProps: MaybeRefOrGetter<object>[]
) {
  return computed(() => ({ ...omit(props, keys), ...mergeExtraProps(...extraProps) }));
}

function mergeExtraProps(...extraProps: MaybeRefOrGetter<object>[]) {
  if (extraProps.length === 0) return {};
  return extraProps.map(prop => toValue(prop) || {}).reduce((acc, curr) => ({ ...acc, ...curr }), {});
}
