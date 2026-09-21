import { computed, shallowRef, useId } from 'vue';
import { getDisclosureState } from '../../shared';
import { useContext, useUiContext } from '../../composables';
import type { DisclosureState } from '../../types';
import type { CollapsibleRootContextParams, CollapsibleUiSlot } from './types';

export const [provideCollapsibleRootContext, useCollapsibleRootContext] = useContext(
  'CollapsibleRoot',
  (params: CollapsibleRootContextParams) => {
    const { open, disabled, unmountOnHide } = params;

    const onOpenToggle = () => {
      if (disabled.value) return;
      open.value = !open.value;
    };

    const contentId = shallowRef('');
    const generatedContentId = `vean-collapsible-content-${useId()}`;

    const initContentId = () => {
      if (contentId.value) return;
      contentId.value = generatedContentId;
    };

    const dataDisabled = computed(() => (disabled.value ? '' : undefined));
    const dataState = computed<DisclosureState>(() => getDisclosureState(open.value));

    return {
      open,
      disabled,
      unmountOnHide,
      onOpenToggle,
      contentId,
      initContentId,
      dataDisabled,
      dataState
    };
  }
);

export const [provideCollapsibleUi, useCollapsibleUi] = useUiContext<CollapsibleUiSlot>('CollapsibleUi');
