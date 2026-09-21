<script setup lang="ts">
import { SButton, toast } from '@vean/ui';

function openInvertToast() {
  toast('Inverted appearance', {
    description: 'This one uses the foreground/background inversion palette.',
    inverted: true,
    duration: 4200
  });
}

function openCustomIconToast() {
  toast('Custom icon', {
    description: 'Overrides the content icon for this toast while keeping the shared close button style.',
    icon: 'lucide:rocket',
    ui: {
      icon: 'text-primary'
    },
    duration: 3600
  });
}

function openClassNamesToast() {
  toast.success('Ui override', {
    description: 'Uses custom ui for toast, title and description.',
    duration: 3600,
    ui: {
      toast: 'shadow-lg shadow-success/10',
      title: 'tracking-wide uppercase text-xs',
      description: 'text-[13px]'
    }
  });
}

function openLayoutOverrideToast() {
  toast('Layout override', {
    description: 'This keeps the built-in style but overrides spacing, width and shadow through className.',
    duration: 4200,
    icon: 'lucide:palette',
    ui: {
      toast: 'w-110 gap-4 rounded-2xl border-primary/60 shadow-xl shadow-primary/10',
      icon: 'text-primary'
    }
  });
}
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex flex-wrap gap-2">
      <SButton variant="pure" @click="openInvertToast">Invert</SButton>
      <SButton color="primary" variant="outline" @click="openCustomIconToast">Custom Icon</SButton>
      <SButton color="success" variant="outline" @click="openClassNamesToast">ClassNames</SButton>
      <SButton color="warning" variant="outline" @click="openLayoutOverrideToast">Layout Override</SButton>
    </div>
  </div>
</template>
