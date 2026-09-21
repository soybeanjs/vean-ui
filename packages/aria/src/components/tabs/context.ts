import { ref, computed, shallowRef, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { isNullish } from '../../shared';
import { useDirection } from '../config-provider/context';
import { useContext, useUiContext } from '../../composables';
import type { AcceptableValue, DefinedValue } from '../../types';
import type { TabsRootContextParams, TabsUiSlot } from './types';

export const [provideTabsRootContext, useTabsRootContext] = useContext('TabsRoot', (params: TabsRootContextParams) => {
  const dir = useDirection(params.dir);

  const listElement = shallowRef<HTMLElement>();

  const onListElementChange = (el: HTMLElement) => {
    listElement.value = el;
  };

  const changeModelValue = (v: AcceptableValue) => {
    if (isNullish(v)) return;
    params.modelValue.value = v;
  };

  const contentIds = ref<string[]>([]);

  const registerContentId = (id: string) => {
    contentIds.value.push(id);
  };

  const unregisterContentId = (id: string) => {
    const index = contentIds.value.indexOf(id);
    if (index !== -1) {
      contentIds.value.splice(index, 1);
    }
  };

  const getId = (value: MaybeRefOrGetter<DefinedValue>) => {
    const id = toValue(value);

    const contentId = computed(() => `vean-tabs-content-${id}`);
    const triggerId = computed(() => `vean-tabs-trigger-${id}`);

    const existContentId = computed(() => contentIds.value.includes(contentId.value));

    return {
      contentId,
      triggerId,
      existContentId
    };
  };

  return {
    ...params,
    dir,
    changeModelValue,
    listElement,
    onListElementChange,
    getId,
    registerContentId,
    unregisterContentId
  };
});

export const [provideTabsUi, useTabsUi] = useUiContext<TabsUiSlot>('TabsUi');
