import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import { provideListboxUi } from '../listbox/context';
import { providePopperUi } from '../popper/context';
import { useContext, useUiContext } from '../../composables';
import type { ComboboxRootContext, ComboboxUiSlot } from './types';

export const [provideComboboxRootContext, useComboboxRootContext] = useContext<ComboboxRootContext>('ComboboxRoot');

export const [provideComboboxContentContext, useComboboxContentContext] = useContext<{
  position: ComputedRef<'inline' | 'popper'>;
}>('ComboboxContent');

export const [provideComboboxUi, useComboboxUi] = useUiContext<ComboboxUiSlot>('ComboboxUi', ui => {
  const listboxUi = computed(() => ({
    ...ui.value,
    content: ui.value?.viewport,
    filterRoot: ui.value?.inputRoot,
    filterControl: ui.value?.inputControl
  }));

  providePopperUi(ui);
  provideListboxUi(listboxUi);

  return ui;
});
