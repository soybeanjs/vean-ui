import { computed, getCurrentInstance } from 'vue';

/**
 * A composable to handle boolean props.
 *
 * It can get undefined value for boolean props witch are not set default value
 * @param key
 */
export function useBoolProp(key: string) {
  const instance = getCurrentInstance();

  return computed(() => {
    const bool = instance?.vnode?.props?.[key];

    return (bool === true || bool === '' ? true : bool) as boolean | undefined;
  });
}
