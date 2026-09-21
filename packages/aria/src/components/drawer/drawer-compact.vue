<script setup lang="ts">
import { computed } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import type { IconValue } from '../_icon/types';
import { DialogPortal as DrawerPortal } from '../dialog';
import type { DialogAlertType } from '../dialog/types';
import { useDrawerUi } from './context';
import DrawerCancel from './drawer-cancel.vue';
import DrawerClose from './drawer-close.vue';
import DrawerConfirm from './drawer-confirm.vue';
import DrawerContent from './drawer-content.vue';
import DrawerDescription from './drawer-description.vue';
import DrawerFooter from './drawer-footer.vue';
import DrawerHandle from './drawer-handle.vue';
import DrawerHeader from './drawer-header.vue';
import DrawerOverlay from './drawer-overlay.vue';
import DrawerPopup from './drawer-popup.vue';
import DrawerRootNested from './drawer-root-nested.vue';
import DrawerRoot from './drawer-root.vue';
import DrawerSwipeArea from './drawer-swipe-area.vue';
import DrawerTitle from './drawer-title.vue';
import DrawerTrigger from './drawer-trigger.vue';
import type { DrawerCompactProps, DrawerCompactEmits, DrawerCompactSlots } from './types';

defineOptions({
  name: 'DrawerCompact'
});

const props = withDefaults(defineProps<DrawerCompactProps>(), {
  open: undefined,
  // Must stay `undefined` — a cast `false` would reach `DrawerRoot` as a
  // controlled fullscreen value and freeze the state (see `DrawerRoot`).
  fullscreen: undefined,
  modal: true,
  shouldScaleBackground: true,
  setBackgroundColorOnScale: true,
  dismissible: true,
  showClose: true,
  showConfirm: true,
  swipeable: false,
  alertType: 'default',
  showCancel: 'onlyWarning',
  side: 'bottom'
});

const forwardedProps = useOmitProps(props, [
  'title',
  'description',
  'icon',
  'showClose',
  'pure',
  'showCancel',
  'cancelText',
  'showConfirm',
  'confirmText',
  'triggerProps',
  'overlayProps',
  'portalProps',
  'popupProps',
  'headerProps',
  'contentProps',
  'footerProps',
  'titleProps',
  'descriptionProps',
  'closeProps',
  'cancelProps',
  'confirmProps',
  'handleProps',
  'swipeable',
  'swipeAreaProps'
]);

const emit = defineEmits<DrawerCompactEmits>();

const slots = defineSlots<DrawerCompactSlots>();

const listeners = useForwardListeners(emit);

const messages = useLocaleMessages();

const ui = useDrawerUi();

const triggerProps = computed(() => ({
  ...props.triggerProps,
  asChild: props.triggerProps?.asChild ?? true
}));

const icons: Record<DialogAlertType, IconValue> = {
  default: null,
  info: 'lucide:info',
  warning: 'lucide:circle-alert',
  error: 'lucide:circle-x',
  success: 'lucide:circle-check'
};

const icon = computed(() => {
  if (props.icon) return props.icon;

  if (props.isAlert && props.alertType) {
    return icons[props.alertType];
  }

  return null;
});

const showConfirm = computed(() => props.showConfirm ?? props.isAlert);

const showCancel = computed(() => {
  if (typeof props.showCancel === 'boolean') return props.showCancel;

  return props.isAlert === true && props.alertType === 'warning';
});

const showFooter = computed(() => {
  if (props.pure) return false;

  if (slots.footer) return true;

  return showCancel.value || showConfirm.value;
});

const cancelText = computed(() => props.cancelText ?? messages.value.dialog.cancel);

const confirmText = computed(() => props.confirmText ?? messages.value.dialog.confirm);
</script>

<template>
  <component :is="nested ? DrawerRootNested : DrawerRoot" v-slot="slotProps" v-bind="forwardedProps" v-on="listeners">
    <DrawerTrigger v-bind="triggerProps">
      <slot name="trigger" v-bind="slotProps" />
    </DrawerTrigger>
    <DrawerSwipeArea v-if="swipeable" v-bind="swipeAreaProps" />
    <DrawerPortal v-bind="portalProps">
      <DrawerOverlay v-bind="overlayProps" />
      <DrawerPopup v-bind="popupProps">
        <DrawerHandle v-if="side === 'bottom'" v-bind="handleProps" />
        <DrawerHeader v-if="!pure" v-bind="headerProps">
          <DrawerTitle v-bind="titleProps">
            <Icon v-if="icon" :icon="icon" :class="ui.icon" />
            <slot name="title" v-bind="slotProps">
              <span>{{ title }}</span>
            </slot>
          </DrawerTitle>
          <DrawerDescription v-if="slots.description || description" v-bind="descriptionProps">
            <slot name="description" v-bind="slotProps">{{ description }}</slot>
          </DrawerDescription>
          <DrawerClose v-if="!isAlert && showClose">
            <slot name="close" v-bind="slotProps" />
          </DrawerClose>
        </DrawerHeader>
        <DrawerContent v-bind="contentProps">
          <slot v-bind="slotProps" />
        </DrawerContent>
        <DrawerClose v-if="pure && !isAlert && showClose">
          <slot name="close" v-bind="slotProps" />
        </DrawerClose>
        <DrawerFooter v-if="showFooter" v-bind="footerProps">
          <slot name="footer" v-bind="slotProps">
            <DrawerCancel v-if="showCancel" v-bind="cancelProps" @cancel="emit('cancel', $event)">
              <slot name="cancel" v-bind="slotProps">{{ cancelText }}</slot>
            </DrawerCancel>
            <DrawerConfirm v-if="showConfirm" v-bind="confirmProps" @confirm="emit('confirm', $event)">
              <slot name="confirm" v-bind="slotProps">{{ confirmText }}</slot>
            </DrawerConfirm>
          </slot>
        </DrawerFooter>
      </DrawerPopup>
    </DrawerPortal>
  </component>
</template>
