<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useForwardListeners, useOmitProps } from '../../composables';
import { useLocaleMessages } from '../../locale';
import Icon from '../_icon/icon.vue';
import type { IconValue } from '../_icon/types';
import DialogPortal from '../portal/portal.vue';
import { useDialogUi, useDialogProviderContext, provideDialogCompactContext } from './context';
import DialogCancel from './dialog-cancel.vue';
import DialogClose from './dialog-close.vue';
import DialogConfirm from './dialog-confirm.vue';
import DialogContent from './dialog-content.vue';
import DialogDescription from './dialog-description.vue';
import DialogFooter from './dialog-footer.vue';
import DialogFullscreen from './dialog-fullscreen.vue';
import DialogHeader from './dialog-header.vue';
import DialogOverlay from './dialog-overlay.vue';
import DialogPopup from './dialog-popup.vue';
import DialogRoot from './dialog-root.vue';
import DialogTitle from './dialog-title.vue';
import DialogTrigger from './dialog-trigger.vue';
import type { DialogCompactProps, DialogCompactEmits, DialogCompactSlots, DialogAlertType } from './types';

defineOptions({
  name: 'DialogCompact'
});

const props = withDefaults(defineProps<DialogCompactProps>(), {
  open: undefined,
  fullscreen: undefined,
  modal: true,
  showClose: true,
  showFullscreen: true,
  showConfirm: true,
  alertType: 'default',
  showCancel: 'onlyWarning'
});

const forwardedProps = useOmitProps(props, [
  'title',
  'description',
  'icon',
  'showClose',
  'showFullscreen',
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
  'fullscreenProps',
  'cancelProps',
  'confirmProps'
]);

const emit = defineEmits<DialogCompactEmits>();

const slots = defineSlots<DialogCompactSlots>();

const attrs = useAttrs();

const listeners = useForwardListeners(emit);

const messages = useLocaleMessages();

const providerContext = useDialogProviderContext();

const dialog = computed(() => providerContext?.getCurrentDialog(attrs['data-dialog-id'] as string));

const iconCls = computed(() => [useDialogUi().value?.icon, dialog.value?.ui?.icon].filter(Boolean).join(' '));

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

provideDialogCompactContext({
  dialog
});
</script>

<template>
  <DialogRoot
    v-slot="slotProps"
    v-bind="forwardedProps"
    @update:open="emit('update:open', $event)"
    @update:fullscreen="emit('update:fullscreen', $event)"
  >
    <DialogTrigger v-bind="triggerProps">
      <slot name="trigger" v-bind="slotProps" />
    </DialogTrigger>
    <DialogPortal v-bind="portalProps">
      <DialogOverlay v-bind="overlayProps" />
      <DialogPopup v-bind="popupProps" v-on="listeners">
        <DialogHeader v-if="!pure" v-bind="headerProps">
          <DialogTitle v-bind="titleProps">
            <Icon v-if="icon" :icon="icon" :class="iconCls" />
            <slot name="title" v-bind="slotProps">
              <span>{{ title }}</span>
            </slot>
          </DialogTitle>
          <DialogDescription v-if="slots.description || description" v-bind="descriptionProps">
            <slot name="description" v-bind="slotProps">{{ description }}</slot>
          </DialogDescription>
          <DialogFullscreen
            v-if="!isAlert && showFullscreen"
            v-bind="fullscreenProps"
            @fullscreen="emit('fullscreen', $event)"
          >
            <slot name="fullscreen" v-bind="slotProps" />
          </DialogFullscreen>
          <DialogClose v-if="!isAlert && showClose" @close="emit('close', $event)">
            <slot name="close" v-bind="slotProps" />
          </DialogClose>
        </DialogHeader>
        <DialogContent v-bind="contentProps">
          <slot v-bind="slotProps" />
        </DialogContent>
        <DialogClose v-if="pure && !isAlert && showClose" @close="emit('close', $event)">
          <slot name="close" v-bind="slotProps" />
        </DialogClose>
        <DialogFooter v-if="showFooter" v-bind="footerProps">
          <slot name="footer" v-bind="slotProps">
            <DialogCancel v-if="showCancel" v-bind="cancelProps" @cancel="emit('cancel', $event)">
              <slot name="cancel" v-bind="slotProps">{{ cancelText }}</slot>
            </DialogCancel>
            <DialogConfirm v-if="showConfirm" v-bind="confirmProps" @confirm="emit('confirm', $event)">
              <slot name="confirm" v-bind="slotProps">{{ confirmText }}</slot>
            </DialogConfirm>
          </slot>
        </DialogFooter>
      </DialogPopup>
    </DialogPortal>
  </DialogRoot>
</template>
