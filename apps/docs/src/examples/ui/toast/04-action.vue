<script setup lang="ts">
import { h } from 'vue';
import { SButton, toast } from '@vean/ui';

function openActionToast() {
  toast('Project archived', {
    description: 'You can restore it before the retention window closes.',
    action: 'Undo',
    onAction: () => {
      toast.success('Archive reverted', {
        description: 'The project is active again.'
      });
    },
    cancel: 'Dismiss',
    duration: Infinity
  });
}

function openCustomToast() {
  toast.custom(
    h(
      'div',
      {
        class: 'flex items-center gap-3 rounded-lg border border-neutral-2 bg-white px-4 py-3 shadow-sm'
      },
      [
        h('div', { class: 'i-lucide-sparkles h-4 w-4 text-primary' }),
        h('div', { class: 'flex-1' }, [
          h('div', { class: 'text-sm font-medium text-neutral-9' }, 'Custom VNode content')
        ])
      ]
    )
  );
}
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-wrap gap-2">
      <SButton variant="pure" @click="openActionToast">Action Toast</SButton>
      <SButton color="primary" variant="outline" @click="openCustomToast">Custom Content</SButton>
    </div>
  </div>
</template>
