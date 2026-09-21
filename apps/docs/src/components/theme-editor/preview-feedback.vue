<script setup lang="ts">
import { SAlert, SBadge, SButton, SButtonIcon, SPopconfirm, SProgress, STag, toast } from '@vean/ui';
import type { TagVariant, ThemeColor } from '@vean/ui';

defineOptions({
  name: 'ThemeEditorPreviewFeedback'
});

/** the four status roles of the feedback scheme, most common first. */
const statuses: ThemeColor[] = ['destructive', 'success', 'warning', 'info'];

const tagVariants: TagVariant[] = ['solid', 'soft', 'outline'];

/**
 * the two tokens every status role expands to: the solid and its on-solid text.
 *
 * A softer treatment is **composed**, not tokenised (a role's own ramp is the
 * other route): the tiles below are the same composition the alert / tag / toast
 * recipes use.
 */
const roleTokens = ['destructive', 'destructive-foreground'];

const roleTiles = [
  { token: 'destructive', class: 'bg-destructive text-destructive-foreground' },
  { token: 'destructive/10', class: 'bg-destructive/10 text-destructive' },
  { token: 'destructive/30', class: 'border-destructive/30 border-2 bg-card text-destructive' }
];

function notifyInfo() {
  toast.info('Theme preview', { description: 'Info toasts read the info role tokens.' });
}

function notifySuccess() {
  toast.success('Theme preview', { description: 'Success toasts read the success role tokens.' });
}

function notifyWarning() {
  toast.warning('Theme preview', { description: 'Warning toasts read the warning role tokens.' });
}

function notifyError() {
  toast.error('Theme preview', { description: 'Error toasts read the destructive role tokens.' });
}
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SAlert</p>
    <div class="grid gap-3 sm:grid-cols-2">
      <SAlert
        v-for="status in statuses"
        :key="status"
        :color="status"
        variant="soft"
        icon="lucide:circle-alert"
        :title="status"
        description="Feedback scheme role"
      />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">SBadge · STag · SProgress</p>
    <div class="flex flex-wrap items-center gap-6">
      <SBadge v-for="status in statuses" :key="`badge-${status}`" :color="status" content="9">
        <SButtonIcon icon="lucide:bell" variant="pure" :aria-label="status" />
      </SBadge>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <template v-for="variant in tagVariants" :key="variant">
        <STag v-for="status in statuses" :key="`${variant}-${status}`" :color="status" :variant="variant">
          {{ variant }}
        </STag>
      </template>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <SProgress
        v-for="status in statuses"
        :key="`progress-${status}`"
        :model-value="70"
        :color="status"
        class="w-32"
      />
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">toast · SPopconfirm</p>
    <div class="flex flex-wrap items-center gap-3">
      <SButton color="info" variant="outline" @click="notifyInfo">info</SButton>
      <SButton color="success" variant="outline" @click="notifySuccess">success</SButton>
      <SButton color="warning" variant="outline" @click="notifyWarning">warning</SButton>
      <SButton color="destructive" variant="outline" @click="notifyError">error</SButton>
      <SPopconfirm title="Delete item?" description="Status roles also paint confirmation dialogs." type="error">
        <template #trigger>
          <SButton variant="pure">Popconfirm</SButton>
        </template>
      </SPopconfirm>
    </div>
  </div>

  <div class="space-y-2">
    <p class="text-xs text-muted-foreground">{{ roleTokens.join(' · ') }}</p>
    <div class="flex flex-wrap items-center gap-3">
      <div
        v-for="tile in roleTiles"
        :key="tile.token"
        :class="tile.class"
        class="flex h-10 items-center rounded-sm px-3 text-xs"
      >
        {{ tile.token }}
      </div>
    </div>
  </div>
</template>
