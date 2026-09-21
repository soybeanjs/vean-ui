<script setup lang="ts">
import { shallowRef } from 'vue';
import { SButtonIcon, SNavMenu, SSelect, SSwitch } from '@vean/ui';
import type { DataOrientation, Direction, NavMenuOptionData, SelectOptionData, ThemeSize } from '@vean/ui';
import { themeSizeOptions } from '~/constants/theme';

interface Props {
  playgroundRegion?: string;
}

defineProps<Props>();

const { t } = useI18n();

/** 自定义器状态：只保存「怎么渲染」，预览完全由它派生，不存在第二份镜像状态。 */
interface CustomizerState {
  orientation: DataOrientation;
  size: ThemeSize;
  dir: Direction;
  disableClickTrigger: boolean;
  disableHoverTrigger: boolean;
  disablePointerLeaveClose: boolean;
}

/** 默认形态：`reset` 回到这份快照，所以它是常量而不是状态。 */
const DEFAULTS: CustomizerState = {
  orientation: 'horizontal',
  size: 'md',
  dir: 'ltr',
  disableClickTrigger: false,
  disableHoverTrigger: false,
  disablePointerLeaveClose: false
};

/** 选项表只有「值即文案」一种形态，用一个纯函数生成，避免多份复制粘贴。 */
const toOptions = <T extends string>(values: readonly T[]): { value: T; label: T }[] =>
  values.map(value => ({ value, label: value }));

const ORIENTATION_KEYS: readonly DataOrientation[] = ['horizontal', 'vertical'];
const DIR_KEYS: readonly Direction[] = ['ltr', 'rtl'];

const orientationItems: SelectOptionData<DataOrientation>[] = toOptions(ORIENTATION_KEYS);
const dirItems: SelectOptionData<Direction>[] = toOptions(DIR_KEYS);

const menus: NavMenuOptionData[] = [
  {
    value: 'guide',
    label: 'Guide',
    icon: 'lucide:book-open',
    href: '/getting-started',
    children: [
      {
        value: 'introduction',
        label: 'Introduction',
        description: 'Fully styled and customizable components for Nuxt.',
        icon: 'lucide:house',
        href: '/getting-started/introduction'
      },
      {
        value: 'installation',
        label: 'Installation',
        description: 'Learn how to install and configure Nuxt UI in your application.',
        icon: 'lucide:cloud-download',
        href: '/getting-started/installation'
      },
      {
        value: 'icons',
        label: 'Icons',
        icon: 'lucide:smile',
        description: 'You have nothing to do, @nuxt/icon will handle it automatically.',
        href: '/getting-started/icons'
      },
      {
        value: 'colors',
        label: 'Colors',
        icon: 'lucide:palette',
        description: 'Choose a primary and a neutral color from your Tailwind CSS theme.',
        href: '/getting-started/colors'
      },
      {
        value: 'theme',
        label: 'Theme',
        icon: 'lucide:swatch-book',
        description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.',
        href: '/getting-started/theme'
      }
    ]
  },
  {
    value: 'composables',
    label: 'Composables',
    icon: 'lucide:database',
    href: '/composables',
    children: [
      {
        value: 'defineShortcuts',
        label: 'defineShortcuts',
        icon: 'lucide:file-text',
        description: 'Define shortcuts for your application.',
        href: '/composables/define-shortcuts'
      },
      {
        value: 'useModal',
        label: 'useModal',
        icon: 'lucide:file-text',
        description: 'Display a modal within your application.',
        href: '/composables/use-modal'
      },
      {
        value: 'useSlideover',
        label: 'useSlideover',
        icon: 'lucide:file-text',
        description: 'Display a slideover within your application.',
        href: '/composables/use-slideover'
      },
      {
        value: 'useToast',
        label: 'useToast',
        icon: 'lucide:file-text',
        description: 'Display a toast within your application.',
        href: '/composables/use-toast'
      }
    ]
  },
  {
    value: 'components',
    label: 'Components',
    icon: 'lucide:box',
    href: '/components',
    children: [
      {
        value: 'link',
        label: 'Link',
        icon: 'lucide:file-text',
        description: 'Use NuxtLink with superpowers.',
        href: '/components/link'
      },
      {
        value: 'modal',
        label: 'Modal',
        icon: 'lucide:file-text',
        description: 'Display a modal within your application.',
        href: '/components/modal'
      },
      {
        value: 'navigation-menu',
        label: 'NavigationMenu',
        icon: 'lucide:file-text',
        description: 'Display a list of links.',
        href: '/components/navigation-menu'
      },
      {
        value: 'pagination',
        label: 'Pagination',
        icon: 'lucide:file-text',
        description: 'Display a list of pages.',
        href: '/components/pagination'
      },
      {
        value: 'popover',
        label: 'Popover',
        icon: 'lucide:file-text',
        description: 'Display a non-modal dialog that floats around a trigger element.',
        href: '/components/popover'
      },
      {
        value: 'progress',
        label: 'Progress',
        icon: 'lucide:file-text',
        description: 'Show a horizontal bar to indicate task progression.',
        href: '/components/progress'
      }
    ]
  },
  {
    label: 'GitHub',
    value: 'github',
    icon: 'lucide:github',
    href: 'https://github.com/nuxt/ui'
  },
  {
    label: 'Help',
    value: 'help',
    icon: 'lucide:circle-help',
    href: 'https://github.com/nuxt/ui',
    disabled: true
  }
];

const orientation = shallowRef(DEFAULTS.orientation);
const size = shallowRef(DEFAULTS.size);
const dir = shallowRef(DEFAULTS.dir);
const disableClickTrigger = shallowRef(DEFAULTS.disableClickTrigger);
const disableHoverTrigger = shallowRef(DEFAULTS.disableHoverTrigger);
const disablePointerLeaveClose = shallowRef(DEFAULTS.disablePointerLeaveClose);

const reset = (): void => {
  orientation.value = DEFAULTS.orientation;
  size.value = DEFAULTS.size;
  dir.value = DEFAULTS.dir;
  disableClickTrigger.value = DEFAULTS.disableClickTrigger;
  disableHoverTrigger.value = DEFAULTS.disableHoverTrigger;
  disablePointerLeaveClose.value = DEFAULTS.disablePointerLeaveClose;
};
</script>

<template>
  <Teleport defer :to="playgroundRegion ?? 'body'" :disabled="!playgroundRegion">
    <div class="flex flex-wrap gap-4">
      <FieldItem label="orientation">
        <SSelect
          v-model="orientation"
          :items="orientationItems"
          :trigger-props="{ 'aria-label': 'Orientation' }"
          class="w-35"
        />
      </FieldItem>
      <FieldItem label="size">
        <SSelect v-model="size" :items="themeSizeOptions" :trigger-props="{ 'aria-label': 'Size' }" class="w-25" />
      </FieldItem>
      <FieldItem label="dir">
        <SSelect v-model="dir" :items="dirItems" :trigger-props="{ 'aria-label': 'Direction' }" class="w-25" />
      </FieldItem>
      <FieldItem label="disableClickTrigger">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disableClickTrigger" :control-props="{ 'aria-label': 'Disable click trigger' }" />
        </div>
      </FieldItem>
      <FieldItem label="disableHoverTrigger">
        <div class="h-8 flex items-center">
          <SSwitch v-model="disableHoverTrigger" :control-props="{ 'aria-label': 'Disable hover trigger' }" />
        </div>
      </FieldItem>
      <FieldItem label="disablePointerLeaveClose">
        <div class="h-8 flex items-center">
          <SSwitch
            v-model="disablePointerLeaveClose"
            :control-props="{ 'aria-label': 'Disable pointer leave close' }"
          />
        </div>
      </FieldItem>
      <FieldItem :label="t('playground.reset')" class="ml-auto">
        <SButtonIcon icon="lucide:rotate-cw" color="destructive" variant="soft" aria-label="Reset" @click="reset" />
      </FieldItem>
    </div>
  </Teleport>

  <div class="flex justify-center w-full">
    <SNavMenu
      :items="menus"
      :orientation="orientation"
      :size="size"
      :dir="dir"
      :disable-click-trigger="disableClickTrigger"
      :disable-hover-trigger="disableHoverTrigger"
      :disable-pointer-leave-close="disablePointerLeaveClose"
      :ui="{ subLink: 'w-60' }"
      :class="orientation === 'vertical' ? 'w-60 lt-md:w-auto' : 'w-max'"
    />
  </div>
</template>
