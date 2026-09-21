<script setup lang="ts">
import { shallowRef, watchEffect, nextTick, onWatcherCleanup } from 'vue';
import DynamicRender from '../_common/dynamic-render.vue';
import { provideDialogProviderContext } from './context';
import DialogCompact from './dialog-compact.vue';
import { DialogState } from './state';
import type { DialogT } from './types';

defineOptions({
  name: 'DialogProvider',
  inheritAttrs: false
});

const dialogs = shallowRef<DialogT[]>([]);

const upsertDialog = (nextDialog: DialogT) => {
  const indexOfExistingDialog = dialogs.value.findIndex(dialog => dialog.id === nextDialog.id);

  if (indexOfExistingDialog !== -1) {
    const mergedDialog = Object.assign({}, dialogs.value[indexOfExistingDialog] as DialogT, nextDialog);

    dialogs.value = [
      ...dialogs.value.slice(0, indexOfExistingDialog),
      mergedDialog,
      ...dialogs.value.slice(indexOfExistingDialog + 1)
    ];
    return;
  }

  dialogs.value = [nextDialog, ...dialogs.value];
};

const onClose = (dialog: DialogT) => {
  dialog.onDismiss?.(dialog);

  DialogState.dismiss(dialog.id);
};

const onCancel = (dialog: DialogT, event: MouseEvent) => {
  dialog.onCancel?.(event);

  if (event.defaultPrevented) {
    return;
  }

  onClose(dialog);
};

const onConfirm = (dialog: DialogT, event: MouseEvent) => {
  dialog.onConfirm?.(event);

  if (event.defaultPrevented) {
    return;
  }

  onClose(dialog);
};

provideDialogProviderContext({
  dialogs
});

watchEffect(
  () => {
    const unsubscribe = DialogState.subscribe(dialog => {
      nextTick(() => {
        upsertDialog(dialog);
      });

      if (dialog.open === false) {
        setTimeout(() => {
          dialogs.value = DialogState.activeDialogs();
        }, 500);
      }
    });

    onWatcherCleanup(() => {
      unsubscribe();
    });
  },
  { flush: 'post' }
);
</script>

<template>
  <DialogCompact
    v-for="dialog in dialogs"
    :key="dialog.id"
    :open="dialog.open"
    is-alert
    :alert-type="dialog.type"
    :data-dialog-id="dialog.id"
    :icon="dialog.icon"
    @close="onClose(dialog)"
    @cancel="onCancel(dialog, $event)"
    @confirm="onConfirm(dialog, $event)"
  >
    <template v-if="dialog.title" #title>
      <DynamicRender :is="dialog.title" />
    </template>
    <template v-if="dialog.description" #description>
      <DynamicRender :is="dialog.description" />
    </template>
    <component :is="dialog.content" v-if="dialog.content" />
    <template v-if="dialog.footer" #footer>
      <DynamicRender :is="dialog.footer" />
    </template>
    <template v-if="dialog.cancelText" #cancel>
      <DynamicRender :is="dialog.cancelText" />
    </template>
    <template v-if="dialog.confirmText" #confirm>
      <DynamicRender :is="dialog.confirmText" />
    </template>
  </DialogCompact>
  <slot />
</template>
