<script setup lang="ts">
import { computed, inject } from 'vue';
import { Icon as Iconify } from '@iconify/vue';
import type { IconifyIcon } from '@iconify/vue';
import { UI_CONFIG_PROVIDER_CONTEXT_KEY } from '../../constants';
import type { IconProps, IconValue } from './types';

defineOptions({
  name: 'SIcon'
});

const props = withDefaults(defineProps<IconProps>(), {
  ariaHidden: true
});

interface IconContext {
  iconify?: {
    width?: string;
    height?: string;
  };
}

const context = inject<IconContext>(UI_CONFIG_PROVIDER_CONTEXT_KEY);

const iconifySize = computed(() => {
  const { width, height } = props;

  const config = context?.iconify || {};

  return {
    width: width || config.width,
    height: height || config.height
  };
});

const resolvedAriaHidden = computed(() => {
  if (props.ariaLabel || props.ariaLabelledby) {
    return false;
  }
  return props.ariaHidden;
});

const forwardedProps = computed(() => ({
  'aria-hidden': resolvedAriaHidden.value,
  'aria-label': props.ariaLabel,
  'aria-labelledby': props.ariaLabelledby
}));

const iconifyProps = computed(() => {
  if (!isIconifyIcon(props.icon)) {
    return null;
  }

  return {
    ...forwardedProps.value,
    // 图标数据是异步加载的:SSR 端(`ssr` 开启时)可能已渲染真实图标,客户端
    // 水合时仍是占位图(viewBox 等属性、iconify--* class 均不同)。这是
    // check-only 的固有差异,声明允许 class + attribute 层 mismatch,避免
    // 每次刷新产生 hydration 告警;挂载后 Iconify 会重渲染为真实图标。
    'data-allow-mismatch': 'class,attribute',
    ...iconifySize.value,
    // 转发 Iconify 变换与渲染选项，避免声明过的 props 被静默丢弃
    mode: props.mode,
    color: props.color,
    flip: props.flip,
    // flip 族仅转发真值，避免 Boolean cast 的 false 默认值覆盖 flip 字符串派生的变换
    horizontalFlip: props.horizontalFlip || undefined,
    verticalFlip: props.verticalFlip || undefined,
    rotate: props.rotate,
    hFlip: props.hFlip || undefined,
    vFlip: props.vFlip || undefined,
    inline: props.inline,
    // 元素属性
    id: props.id,
    style: props.style,
    title: props.title,
    // Iconify 图标加载钩子
    ssr: props.ssr,
    customise: props.customise,
    icon: props.icon
  };
});

function isIconifyIcon(icon: IconValue): icon is IconifyIcon | string {
  if (!icon) {
    return false;
  }

  return typeof icon === 'string' || (typeof icon === 'object' && 'body' in icon);
}
</script>

<template>
  <Iconify v-if="iconifyProps" v-bind="iconifyProps" class="shrink-0" data-vean-icon />
  <component
    :is="icon"
    v-else-if="icon"
    class="shrink-0"
    data-vean-icon
    v-bind="forwardedProps"
    :style="{
      width: iconifySize.width,
      height: iconifySize.height
    }"
  />
</template>
