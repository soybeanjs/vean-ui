<script setup lang="ts">
import { ref } from 'vue';
import { SButton, SDrawer, SInput, STextarea } from '@vean/ui';

const open = ref(false);

const contact = ref({
  name: '',
  email: '',
  note: ''
});
</script>

<template>
  <div class="flex justify-center w-full">
    <SDrawer
      v-model:open="open"
      title="New contact"
      description="A form inside a sheet. Tapping a field raises the on-screen keyboard; the sheet keeps its resting position while the input is focused."
    >
      <template #trigger>
        <SButton variant="pure">Open</SButton>
      </template>

      <div class="flex flex-col gap-3 py-2">
        <label class="flex flex-col gap-1.5">
          <span class="text-sm text-muted-foreground">Name</span>
          <SInput v-model="contact.name" placeholder="Soybean" />
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-sm text-muted-foreground">Email</span>
          <SInput v-model="contact.email" type="email" placeholder="soybean@example.com" />
        </label>

        <label class="flex flex-col gap-1.5">
          <span class="text-sm text-muted-foreground">Note</span>
          <STextarea v-model="contact.note" class="min-h-20" placeholder="Anything else?" />
        </label>
      </div>
    </SDrawer>
  </div>
</template>
