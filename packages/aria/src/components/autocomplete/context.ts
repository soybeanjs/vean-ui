import { computed } from 'vue';
import { provideComboboxUi } from '../combobox/context';
import { provideInputUi } from '../input/context';
import { useContext, useUiContext } from '../../composables';
import type { AutocompleteRootContext, AutocompleteUiSlot } from './types';

export const [provideAutocompleteRootContext, useAutocompleteRootContext] =
  useContext<AutocompleteRootContext>('AutocompleteRoot');

export const [provideAutocompleteUi, useAutocompleteUi] = useUiContext<AutocompleteUiSlot>('AutocompleteUi', ui => {
  provideComboboxUi(ui);

  const inputUi = computed(() => ({
    root: ui.value?.inputRoot,
    control: ui.value?.inputControl
  }));

  provideInputUi(inputUi);

  return ui;
});
