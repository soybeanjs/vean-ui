import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import SConfigProvider from '@/components/config-provider/config-provider.vue';
import SPalettePicker from '@/components/palette-picker/palette-picker.vue';
import SThemeCustomizer from '@/components/theme-customizer/theme-customizer.vue';
import type { ThemeCustomizerSection } from '@/components/theme-customizer/types';

/**
 * `SThemeCustomizer` settings → runtime wiring (happy-dom).
 *
 * Both panels write through the same chain: child control emits `update:modelValue`
 * → the panel's listener calls a script-defined setter → `settings.commit()` →
 * `SConfigProvider` re-emits `#vean-theme`. The listener has to *pass the event
 * payload*; a curried factory (`@update:model-value="onChange(key)"`) is invoked as
 * an inline statement, so its returned function is discarded and the write never
 * happens. Driving the child's `update:modelValue` emit from a real mount is exactly
 * the contract that regressed, so it is asserted here instead of a DOM click path.
 */

const STYLE_ID = 'vean-theme';

const flush = async (): Promise<void> => {
  await nextTick();
  await new Promise(resolve => {
    setTimeout(resolve, 16);
  });
};

/** the panels mount their groups one animation frame at a time; poll until settled. */
const waitFor = async (predicate: () => boolean, rounds = 60): Promise<void> => {
  for (let index = 0; index < rounds; index++) {
    if (predicate()) {
      return;
    }

    await flush();
  }
};

const setup = async (sections?: ThemeCustomizerSection[]) => {
  const wrapper = mount(SConfigProvider, {
    props: { persistTheme: false },
    slots: { default: () => h(SThemeCustomizer, sections ? { sections } : {}) },
    attachTo: document.body
  });

  await flush();

  const css = (): string => document.getElementById(STYLE_ID)?.textContent ?? '';

  return { wrapper, css };
};

describe('SThemeCustomizer', () => {
  it('applies a Custom-panel token override to the runtime style element', async () => {
    const { wrapper, css } = await setup(['advanced']);
    const customTab = wrapper.findAll('[role="tab"]').find(tab => tab.text() === 'Custom');

    expect(customTab, 'Custom tab is rendered').toBeTruthy();

    // the trigger activates on mousedown, not click
    await customTab!.trigger('mousedown', { button: 0 });

    await waitFor(() =>
      wrapper.findAll('section').some(section => section.find('h4').exists() && section.find('h4').text() === 'Fills')
    );

    const fills = wrapper
      .findAll('section')
      .find(section => section.find('h4').exists() && section.find('h4').text() === 'Fills');

    expect(fills, 'Fills group is mounted').toBeTruthy();

    // Fills order: muted, accent, accent-foreground, secondary, secondary-foreground
    const accent = fills!.findAllComponents(SPalettePicker)[1];

    expect(accent.props('modelValue')).toBe('zinc.100');
    expect(css()).toContain('--accent: var(--zinc-100);');

    accent.vm.$emit('update:modelValue', 'zinc.200');
    await waitFor(() => css().includes('--accent: var(--zinc-200);'));

    expect(css()).toContain('--accent: var(--zinc-200);');

    wrapper.unmount();
  });

  it('applies a Theme-panel font arm change to the runtime style element', async () => {
    const { wrapper, css } = await setup(['font']);
    const select = wrapper.findAllComponents({ name: 'SSelect' }).find(item => item.props('modelValue') === 'system');

    expect(select, 'font arm select is rendered').toBeTruthy();
    expect(css()).toContain('--font-sans: ui-sans-serif');

    select!.vm.$emit('update:modelValue', 'inter');
    await waitFor(() => css().includes('--font-sans: Inter'));

    expect(css()).toContain('--font-sans: Inter');

    wrapper.unmount();
  });
});
