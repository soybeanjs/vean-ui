import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import type { ClassValue, UiClass } from '../types';
import { useContext } from './use-context';

export type UseUiConsumer<UiSlot extends string> = <S extends UiSlot | undefined = undefined>(
  slot?: S
) => S extends UiSlot ? ComputedRef<ClassValue> : ComputedRef<Partial<UiClass<UiSlot>>>;

export function useUiContext<UiSlot extends string>(
  contextName: string,
  uiHook: (ui: ComputedRef<Partial<UiClass<UiSlot>>>) => ComputedRef<Partial<UiClass<UiSlot>>> = ui => ui
) {
  const [provideUi, injectUi] = useContext(contextName, uiHook);

  const useUi: UseUiConsumer<UiSlot> = (slot?: string) => {
    const ui = injectUi() as ComputedRef<Record<string, any>>;
    if (!slot) {
      return computed(() => ui?.value ?? {});
    }

    return computed(() => ui?.value?.[slot]);
  };

  return [provideUi, useUi] as const;
}
