<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import type { IconValue } from '../_icon/types';
import PopperArrow from '../popper/popper-arrow.vue';
import PopperPortal from '../popper/popper-portal.vue';
import type { PopperOpenChangeReason } from '../popper/types';
import { usePopconfirmUi } from './context';
import PopconfirmCancel from './popconfirm-cancel.vue';
import PopconfirmClose from './popconfirm-close.vue';
import PopconfirmConfirm from './popconfirm-confirm.vue';
import PopconfirmContent from './popconfirm-content.vue';
import PopconfirmDescription from './popconfirm-description.vue';
import PopconfirmFooter from './popconfirm-footer.vue';
import PopconfirmHeader from './popconfirm-header.vue';
import PopconfirmPopup from './popconfirm-popup.vue';
import PopconfirmPositioner from './popconfirm-positioner.vue';
import PopconfirmRoot from './popconfirm-root.vue';
import PopconfirmTitle from './popconfirm-title.vue';
import PopconfirmTrigger from './popconfirm-trigger.vue';
import type { PopconfirmCompactProps, PopconfirmCompactEmits, PopconfirmCompactSlots, PopconfirmType } from './types';

defineOptions({
  name: 'PopconfirmCompact',
  inheritAttrs: false
});

const props = withDefaults(defineProps<PopconfirmCompactProps>(), {
  open: undefined,
  defaultOpen: false,
  modal: false,
  showArrow: true,
  showIcon: true,
  showCancel: 'onlyWarning'
});

const emit = defineEmits<PopconfirmCompactEmits>();

const slots = defineSlots<PopconfirmCompactSlots>();

const forwardedRootProps = useOmitProps(props, [
  'type',
  'placement',
  'title',
  'description',
  'content',
  'showArrow',
  'showIcon',
  'confirmText',
  'cancelText',
  'showCancel',
  'triggerProps',
  'portalProps',
  'positionerProps',
  'popupProps',
  'arrowProps',
  'closeProps',
  'headerProps',
  'titleProps',
  'descriptionProps',
  'contentProps',
  'footerProps',
  'confirmProps',
  'cancelProps'
]);

const listeners = useForwardListeners(emit);

const messages = useLocaleMessages();

const ui = usePopconfirmUi();

const icons: Record<PopconfirmType, IconValue> = {
  error: 'lucide:circle-x',
  success: 'lucide:circle-check',
  warning: 'lucide:circle-alert',
  info: 'lucide:info'
};

const icon = computed(() => {
  if (!props.type) {
    return null;
  }

  return icons[props.type];
});

const triggerProps = computed(() => ({
  ...props.triggerProps,
  asChild: props.triggerProps?.asChild ?? true
}));

const positionerProps = computed(() => ({
  ...props.positionerProps,
  placement: props.placement ?? props.positionerProps?.placement
}));

const popupProps = computed(() => ({
  ...props.popupProps,
  'data-type': props.type
}));

const cancelVisible = computed(() => {
  if (typeof props.showCancel === 'boolean') {
    return props.showCancel;
  }

  return props.type === 'warning';
});

const cancelText = computed(() => props.cancelText ?? messages.value.dialog.cancel);

const confirmText = computed(() => props.confirmText ?? messages.value.dialog.confirm);

function onUpdateOpen(value: boolean, reason: PopperOpenChangeReason) {
  emit('update:open', value, reason);
}

function onConfirm(event: PointerEvent) {
  emit('confirm', event);
}

function onCancel(event: PointerEvent) {
  emit('cancel', event);
}
</script>

<template>
  <PopconfirmRoot v-slot="slotProps" v-bind="forwardedRootProps" @update:open="onUpdateOpen">
    <PopconfirmTrigger v-bind="triggerProps">
      <slot name="trigger" v-bind="slotProps" />
    </PopconfirmTrigger>
    <PopperPortal v-bind="portalProps">
      <PopconfirmPositioner v-bind="positionerProps" v-on="listeners">
        <PopconfirmPopup v-bind="popupProps">
          <PopconfirmHeader v-bind="headerProps">
            <PopconfirmTitle v-bind="titleProps">
              <Icon v-if="showIcon && icon" :class="ui.icon" :icon="icon" />
              <slot name="title" v-bind="slotProps">
                <span>{{ title }}</span>
              </slot>
            </PopconfirmTitle>
            <PopconfirmDescription v-if="slots.description || description" v-bind="descriptionProps">
              <slot name="description" v-bind="slotProps">{{ description }}</slot>
            </PopconfirmDescription>
          </PopconfirmHeader>
          <PopconfirmContent v-if="slots.default || content" v-bind="contentProps">
            <slot v-bind="slotProps">{{ content }}</slot>
          </PopconfirmContent>
          <PopconfirmFooter v-bind="footerProps">
            <slot name="footer" v-bind="slotProps">
              <PopconfirmCancel v-if="cancelVisible" v-bind="cancelProps" @cancel="onCancel">
                {{ cancelText }}
              </PopconfirmCancel>
              <PopconfirmConfirm v-bind="confirmProps" @confirm="onConfirm">
                {{ confirmText }}
              </PopconfirmConfirm>
            </slot>
          </PopconfirmFooter>
          <PopperArrow v-if="showArrow" v-bind="arrowProps" />
        </PopconfirmPopup>
        <PopconfirmClose v-if="slots.close" v-bind="closeProps">
          <slot name="close" v-bind="slotProps" />
        </PopconfirmClose>
      </PopconfirmPositioner>
    </PopperPortal>
  </PopconfirmRoot>
</template>
