import { useContext, useUiContext } from '../../composables';
import type { PageTabsUiSlot, PageTabsRootContext, PageTabsItemContext } from './types';

export const [providePageTabsRootContext, usePageTabsRootContext] = useContext<PageTabsRootContext>('PageTabsRoot');

export const [providePageTabsItemContext, usePageTabsItemContext] = useContext<PageTabsItemContext>('PageTabsItem');

export const [providePageTabsUi, usePageTabsUi] = useUiContext<PageTabsUiSlot>('PageTabsUi');
