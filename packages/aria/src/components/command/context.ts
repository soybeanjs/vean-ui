import { computed } from 'vue';
import { provideListboxUi } from '../listbox/context';
import { useUiContext } from '../../composables';
import type { CommandUiSlot } from './types';

export const [provideCommandUi, useCommandUi] = useUiContext<CommandUiSlot>('CommandUi', ui => {
  const listboxUi = computed(() => ({
    root: ui.value?.root,
    content: ui.value?.list,
    filterRoot: ui.value?.inputRoot,
    filterControl: ui.value?.inputControl,
    item: ui.value?.item,
    itemIndicator: '',
    group: ui.value?.group,
    groupLabel: ui.value?.groupLabel,
    virtualizer: ''
  }));

  provideListboxUi(listboxUi);

  return ui;
});
