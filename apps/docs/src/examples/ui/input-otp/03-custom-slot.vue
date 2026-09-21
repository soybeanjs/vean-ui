<script setup lang="ts">
import { ref } from 'vue';
import { SInputOtp } from '@vean/ui';

const otp = ref('12');
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="flex-c gap-3">
      <div class="w-70 lt-md:w-auto">
        <SInputOtp v-model="otp" :maxlength="6" aria-label="Security code">
          <template #default="{ slots }">
            <div aria-hidden="true" class="flex items-center gap-2">
              <template v-for="(slotItem, index) in slots" :key="index">
                <div
                  class="relative flex size-12 items-center justify-center rounded-2xl border bg-secondary/30 text-xl font-semibold transition"
                  :class="slotItem.isActive ? 'border-primary ring-3 ring-primary/25' : 'border-border'"
                >
                  <span v-if="slotItem.char">{{ slotItem.char }}</span>
                  <span v-else class="text-muted-foreground/50">•</span>
                  <span v-if="slotItem.hasFakeCaret" class="absolute h-5 w-px animate-pulse bg-foreground" />
                </div>
                <div v-if="index === 2" class="text-xl text-muted-foreground">-</div>
              </template>
            </div>
          </template>
        </SInputOtp>
      </div>
    </div>
  </div>
</template>
