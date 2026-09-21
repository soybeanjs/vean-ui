import { useContext, useUiContext, useForwardElement } from '../../composables';
import type { AffixRootContext, AffixUiSlot } from './types';

export const [provideAffixRootContext, useAffixRootContext] = useContext('AffixRoot', (params: AffixRootContext) => {
  const [contentElement, setContentElement] = useForwardElement<HTMLDivElement>();

  return {
    ...params,
    contentElement,
    setContentElement
  };
});

export const [provideAffixUi, useAffixUi] = useUiContext<AffixUiSlot>('AffixUi');
