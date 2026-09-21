import { computed, shallowRef } from 'vue';
import { useDirection } from '../config-provider/context';
import { provideMenuUi } from '../menu/context';
import { useCollection, useContext, useUiContext } from '../../composables';
import type { DefinedValue } from '../../types';
import type {
  MenubarCollectionItemData,
  MenubarMenuContextParams,
  MenubarRootContextParams,
  MenubarUiSlot
} from './types';

export const {
  provideCollectionContext: provideMenubarCollectionContext,
  useCollectionContext: useMenubarCollectionContext,
  useCollectionItem: useMenubarCollectionItem
} = useCollection<MenubarCollectionItemData>('Menubar');

export const [provideMenubarRootContext, useMenubarRootContext] = useContext(
  'MenubarRoot',
  (params: MenubarRootContextParams) => {
    const { modelValue, currentTabStopId } = params;

    const dir = useDirection(params.dir);
    const hoverable = computed(() => params.trigger.value === 'hover');

    const isLinkTriggerHovered = shallowRef(false);

    // Hover timing (open delay, skip-delay window) runs on the Popper hover machine of each
    // menu, coordinated through the delay group provided by `MenubarRoot`; this context only
    // routes which menu is open.
    const onMenuOpen = (value: DefinedValue) => {
      isLinkTriggerHovered.value = false;
      modelValue.value = value;
      currentTabStopId.value = String(value);
    };

    const onMenuClose = () => {
      isLinkTriggerHovered.value = false;
      modelValue.value = '';
    };

    const onMenuToggle = (value: DefinedValue) => {
      isLinkTriggerHovered.value = false;
      modelValue.value = modelValue.value ? '' : value;
      currentTabStopId.value = String(value);
    };

    const setTriggerLink = () => {
      isLinkTriggerHovered.value = true;
      modelValue.value = '';
    };

    return {
      ...params,
      dir,
      hoverable,
      isLinkTriggerHovered,
      onMenuOpen,
      onMenuClose,
      onMenuToggle,
      setTriggerLink
    };
  }
);

export const [provideMenubarMenuContext, useMenubarMenuContext] = useContext(
  'MenubarMenu',
  (params: MenubarMenuContextParams) => params
);

export const [provideMenubarUi, useMenubarUi] = useUiContext<MenubarUiSlot>('MenubarUi', ui => {
  provideMenuUi(ui);

  return ui;
});
