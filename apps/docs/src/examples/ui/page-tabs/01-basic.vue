<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import type { Ref } from 'vue';
import { SButtonIcon, SPageTabs, SSelect, SSwitch } from '@vean/ui';
import type {
  PageTabsContextMenuOptionData,
  PageTabsOptionData,
  PageTabsState,
  PageTabsVariant,
  SelectOptionData,
  ThemeSize
} from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  variant: PageTabsVariant;
  size: ThemeSize;
  draggable: boolean;
  middleClickClose: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  variant: 'chrome',
  size: 'md',
  draggable: false,
  middleClickClose: true
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免多份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const VARIANT_KEYS: readonly PageTabsVariant[] = ['chrome', 'card', 'slider'];

const variantItems: SelectOptionData<PageTabsVariant>[] = toOptions(VARIANT_KEYS);

const items: Ref<PageTabsOptionData[]> = ref([
  { value: 'home', label: 'Home', icon: 'lucide:house', pinned: true, hidePinnedIcon: true },
  { value: 'profile', label: 'Profile', icon: 'lucide:user' },
  { value: 'manage', label: 'Manage', icon: 'lucide:settings' },
  { value: 'doc', label: 'Doc', icon: 'lucide:file-text' },
  { value: 'about', label: 'About', icon: 'lucide:info' }
]);

const modelValue = shallowRef('home');

const variant = shallowRef(DEFAULTS.variant);
const size = shallowRef(DEFAULTS.size);
const draggable = shallowRef(DEFAULTS.draggable);
const middleClickClose = shallowRef(DEFAULTS.middleClickClose);

/** 右键菜单：根据当前 tab 的 pin 状态与关闭能力动态生成。 */
function menuFactory(tab: PageTabsOptionData, state: PageTabsState) {
  const {
    closable,
    close,
    pin,
    unpin,
    leftClosable,
    closeLeft,
    rightClosable,
    closeRight,
    otherClosable,
    closeOther,
    allClosable,
    closeAll
  } = state;

  const menus: PageTabsContextMenuOptionData[] = [
    {
      label: 'Close',
      value: 'close',
      icon: 'lucide:x',
      disabled: !closable,
      action: close
    }
  ];

  if (tab.pinned) {
    menus.push({
      label: 'Unpin',
      value: 'unpin',
      icon: 'lucide:pin-off',
      action: unpin
    });
  } else {
    menus.push({
      label: 'Pin',
      value: 'pin',
      icon: 'lucide:pin',
      action: pin
    });
  }

  menus.push(
    {
      label: 'Close Left',
      value: 'closeLeft',
      icon: 'lucide:arrow-left-to-line',
      disabled: !leftClosable,
      action: closeLeft
    },
    {
      label: 'Close Right',
      value: 'closeRight',
      icon: 'lucide:arrow-right-to-line',
      disabled: !rightClosable,
      action: closeRight
    },
    {
      label: 'Close Others',
      value: 'closeOther',
      icon: 'lucide:fold-horizontal',
      disabled: !otherClosable,
      action: closeOther
    },
    {
      label: 'Close All',
      value: 'closeAll',
      icon: 'lucide:arrow-right-left',
      disabled: !allClosable,
      action: closeAll
    }
  );

  return menus;
}

const reset = (): void => {
  variant.value = DEFAULTS.variant;
  size.value = DEFAULTS.size;
  draggable.value = DEFAULTS.draggable;
  middleClickClose.value = DEFAULTS.middleClickClose;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="variant">
        <SSelect v-model="variant" :items="variantItems" :trigger-props="{ 'aria-label': 'Variant' }" class="w-28" />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="draggable">
        <div class="h-8 flex items-center">
          <SSwitch v-model="draggable" :control-props="{ 'aria-label': 'Draggable' }" />
        </div>
      </FieldItem>
      <FieldItem label="middleClickClose">
        <div class="h-8 flex items-center">
          <SSwitch v-model="middleClickClose" :control-props="{ 'aria-label': 'Middle click close' }" />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <div class="pt-4 border border-border rounded-sm">
      <SPageTabs
        v-model="modelValue"
        v-model:items="items"
        :variant="variant"
        :size="size"
        :draggable="draggable"
        :middle-click-close="middleClickClose"
        :menu-factory="menuFactory"
        class="w-160"
      />
    </div>
  </div>
</template>
