<script setup lang="ts">
import { useForwardElement } from '../../composables';
import { useSelectPopupElementContext, useSelectUi } from './context';
import type { SelectPopupProps } from './types';

defineOptions({
  name: 'SelectItemAlignedPopup'
});

defineProps<SelectPopupProps>();

const { onPopupElementChange } = useSelectPopupElementContext('SelectItemAlignedPopup');

const [_, setPopupElement] = useForwardElement(onPopupElementChange);

const cls = useSelectUi('popup');
</script>

<template>
  <div
    :ref="setPopupElement"
    data-vean-select-item-aligned-popup
    :class="cls"
    style="box-sizing: border-box; max-height: 100%"
  >
    <slot />
  </div>
</template>
