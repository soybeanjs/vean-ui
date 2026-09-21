import { computed, onMounted, reactive } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import type { KbdKey } from '../types';

export const kbdMap: Record<KbdKey, string> = {
  meta: '',
  ctrl: '',
  alt: '',
  win: '⊞',
  command: '⌘',
  shift: '⇧',
  option: '⌥',
  enter: '↵',
  delete: '⌦',
  backspace: '⌫',
  escape: '⎋',
  tab: '⇥',
  capslock: '⇪',
  arrowup: '↑',
  arrowright: '→',
  arrowdown: '↓',
  arrowleft: '←',
  pageup: '⇞',
  pagedown: '⇟',
  home: '↖',
  end: '↘'
};

interface SpecificKbdMap {
  meta: string;
  alt: string;
  ctrl: string;
}

function useKbdKey() {
  const macOS = computed(() => navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/));

  const specificKbdMap: SpecificKbdMap = reactive({
    meta: ' ',
    alt: ' ',
    ctrl: ' '
  });

  function getKeyboardKey(value?: KbdKey | (string & {})) {
    if (!value) {
      return undefined;
    }

    if (['meta', 'alt', 'ctrl'].includes(value)) {
      return specificKbdMap[value as keyof SpecificKbdMap];
    }

    return kbdMap[value as KbdKey] || value.toUpperCase();
  }

  onMounted(() => {
    specificKbdMap.meta = macOS.value ? kbdMap.command : kbdMap.win;
    specificKbdMap.alt = macOS.value ? kbdMap.option : 'alt';
    specificKbdMap.ctrl = macOS.value ? '⌃' : 'ctrl';
  });

  return {
    macOS,
    getKeyboardKey
  };
}

export const useKbd = createSharedComposable(useKbdKey);
