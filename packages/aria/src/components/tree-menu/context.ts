import { computed } from 'vue';
import { provideCollapsibleUi } from '../collapsible/context';
import { useContext, useUiContext } from '../../composables';
import type { TreeMenuItemContext, TreeMenuRootContextParams, TreeMenuUiSlot } from './types';

export const [provideTreeMenuRootContext, useTreeMenuRootContext] = useContext(
  'TreeMenuRoot',
  (params: TreeMenuRootContextParams) => {
    const { modelValue, expanded, collapsed } = params;

    const onModelValueChange = (value: string) => {
      modelValue.value = value;
    };

    const onExpandedChange = (value: string[]) => {
      expanded.value = value;
    };

    const onExpandedToggle = (value: string) => {
      if (expanded.value.includes(value)) {
        expanded.value = expanded.value.filter(v => v !== value);
      } else {
        expanded.value = [...expanded.value, value];
      }
    };

    const onCollapsedChange = (value: boolean) => {
      collapsed.value = value;
    };

    return {
      ...params,
      onModelValueChange,
      onExpandedChange,
      onExpandedToggle,
      onCollapsedChange
    };
  }
);

export const [provideTreeMenuItemContext, useTreeMenuItemContext] = useContext<TreeMenuItemContext>('TreeMenuItem');

export const [provideTreeMenuUi, useTreeMenuUi] = useUiContext<TreeMenuUiSlot>('TreeMenuUi', ui => {
  const collapsibleUi = computed(() => ({
    root: ui.value.collapsibleRoot,
    trigger: ui.value.collapsibleTrigger,
    content: ui.value.collapsibleContent
  }));

  provideCollapsibleUi(collapsibleUi);

  return ui;
});
