import { computed, nextTick, shallowRef, watch } from 'vue';
import type { ShallowRef } from 'vue';

type ControllableValue<T, U extends boolean> = U extends true ? T : Exclude<T, undefined>;

/**
 * A more flexible version of `useControllableState` that supports undefined values.
 *
 * @param prop A function that returns the current value of the prop. It can be undefined if the component is uncontrolled.
 * @param onChange A callback function that is called when the value changes. It receives the new value as an argument. If the component is controlled, this function must be provided.
 * @param defaultValue The default value to use when the component is uncontrolled. It must be provided if the component can be uncontrolled.
 * @param undefinedable A boolean that indicates whether the value can be undefined. If true, the component can be uncontrolled and the value can be undefined. If false, the component must be controlled and the value cannot be undefined. The default value is false.
 */
export function useControllableState<T, U extends boolean = false>(
  prop: () => T,
  onChange: ((value: ControllableValue<T, U>) => void) | undefined,
  defaultValue: ControllableValue<T, U>,
  undefinedable?: U
) {
  const initial = prop();

  if (initial !== undefined) {
    return computed({
      get: () => prop(),
      set: v => {
        onChange?.(v as ControllableValue<T, U>);
      }
    }) as unknown as ShallowRef<ControllableValue<T, U>>;
  }

  const proxy = shallowRef(initial ?? defaultValue);

  let skip = false;

  watch(prop, value => {
    if (skip) return;
    if (value === undefined && !undefinedable) return;

    skip = true;

    proxy.value = value;
    nextTick(() => {
      skip = false;
    });
  });

  watch(proxy, value => {
    if (!skip && (value !== undefined || undefinedable)) {
      onChange?.(value);
    }
  });

  return proxy as unknown as ShallowRef<ControllableValue<T, U>>;
}
