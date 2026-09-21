import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { STagsInput } from '@/components/tags-input';
import { getA11yViolations } from '../../shared/a11y';

const mountCompactTagsInput = (props: Record<string, unknown> = {}) => {
  return mount(STagsInput, {
    props: {
      modelValue: ['Vue', 'TypeScript'],
      clearable: true,
      controlProps: {
        'aria-label': 'Add tag',
        placeholder: 'Add a tag'
      },
      ...props
    },
    attachTo: document.body
  });
};

const ManualTagsInput = {
  components: {
    STagsInput
  },
  props: {
    addOnBlur: Boolean,
    addOnTab: Boolean,
    disabled: Boolean,
    duplicate: Boolean,
    max: Number,
    customClass: String,
    modelValue: {
      type: Array,
      default: () => ['Vue', 'TypeScript']
    }
  },
  template: `
    <STagsInput
      :model-value="modelValue"
      :add-on-blur="addOnBlur"
      :add-on-tab="addOnTab"
      :disabled="disabled"
      :duplicate="duplicate"
      :max="max"
      :class="customClass"
      @update:model-value="$emit('update:modelValue', $event)"
      @invalid="$emit('invalid', $event)"
      @add-tag="$emit('addTag', $event)"
      @remove-tag="$emit('removeTag', $event)"
    />
  `
};

const ControlledCompactTagsInput = {
  components: {
    STagsInput
  },
  data() {
    return {
      tags: ['Vue', 'React', 'Angular']
    };
  },
  template: `
    <STagsInput
      v-model="tags"
      :control-props="{ 'aria-label': 'Add tag', placeholder: 'Add a tag' }"
    />
  `
};

describe('STagsInput', () => {
  describe('rendering', () => {
    it('renders initial tags and input', () => {
      const wrapper = mountCompactTagsInput();

      expect(wrapper.text()).toContain('Vue');
      expect(wrapper.text()).toContain('TypeScript');
      expect(wrapper.find('input').exists()).toBe(true);

      wrapper.unmount();
    });

    it('applies custom class to the root element', () => {
      const wrapper = mountCompactTagsInput({ class: 'my-tags-input' });

      expect(wrapper.html()).toContain('my-tags-input');

      wrapper.unmount();
    });

    it('keeps manual default-slot composition working', () => {
      const wrapper = mount(ManualTagsInput, { attachTo: document.body });

      expect(wrapper.text()).toContain('Vue');

      wrapper.unmount();
    });

    it('shows the clear trigger by default', () => {
      const wrapper = mountCompactTagsInput();

      expect(wrapper.find('[data-vean-tags-input-clear]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('hides the clear trigger when clearable is false', () => {
      const wrapper = mountCompactTagsInput({ clearable: false });

      expect(wrapper.find('[data-vean-tags-input-clear]').exists()).toBe(false);

      wrapper.unmount();
    });

    it('applies the size variant class to the root', () => {
      const wrapper = mountCompactTagsInput({ size: 'lg' });

      expect(wrapper.find('[data-vean-tags-input-root]').classes()).toContain('min-h-9');

      wrapper.unmount();
    });

    it('forwards itemProps, itemTextProps and itemDeleteProps to the sub-parts', () => {
      const wrapper = mountCompactTagsInput({
        itemProps: { class: 'custom-item' },
        itemTextProps: { class: 'custom-text' },
        itemDeleteProps: { class: 'custom-delete' }
      });

      expect(wrapper.find('[data-vean-tags-input-item]').classes()).toContain('custom-item');
      expect(wrapper.find('[data-vean-tags-input-item-text]').classes()).toContain('custom-text');
      expect(wrapper.find('[data-vean-tags-input-item-delete]').classes()).toContain('custom-delete');

      wrapper.unmount();
    });
  });

  describe('model value', () => {
    it('emits update:modelValue and addTag on enter', async () => {
      const wrapper = mountCompactTagsInput();
      const input = wrapper.find('input');

      await input.setValue('Nuxt');
      await input.trigger('keydown.enter');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('addTag')?.[0]).toEqual(['Nuxt']);

      wrapper.unmount();
    });

    it('does not add an empty or whitespace-only value on enter', async () => {
      const wrapper = mountCompactTagsInput();
      const input = wrapper.find('input');

      await input.setValue('   ');
      await input.trigger('keydown.enter');

      expect(wrapper.emitted('addTag')).toBeFalsy();

      wrapper.unmount();
    });

    it('trims surrounding whitespace before adding', async () => {
      const wrapper = mountCompactTagsInput();
      const input = wrapper.find('input');

      await input.setValue('  Nuxt  ');
      await input.trigger('keydown.enter');

      expect(wrapper.emitted('addTag')?.[0]).toEqual(['Nuxt']);

      wrapper.unmount();
    });

    it('adds a tag on tab when addOnTab is enabled', async () => {
      const wrapper = mountCompactTagsInput({ addOnTab: true });
      const input = wrapper.find('input');

      await input.setValue('Nuxt');
      await input.trigger('keydown', { key: 'Tab' });
      await flushPromises();

      expect(wrapper.emitted('addTag')?.[0]).toEqual(['Nuxt']);

      wrapper.unmount();
    });

    it('adds a tag on blur when addOnBlur is enabled', async () => {
      const wrapper = mountCompactTagsInput({ addOnBlur: true });
      const input = wrapper.find('input');

      await input.setValue('React');
      await input.trigger('blur');

      expect(wrapper.emitted('addTag')?.[0]).toEqual(['React']);

      wrapper.unmount();
    });

    it('skips adding on blur when focus moves inside the tag list', async () => {
      const wrapper = mountCompactTagsInput({ addOnBlur: true, id: 'ti' });
      const input = wrapper.find('input');
      const deleteButton = wrapper.find('[data-vean-tags-input-item-delete]');

      await input.setValue('Half');
      await input.trigger('blur', { relatedTarget: deleteButton.element });
      expect(wrapper.emitted('addTag')).toBeFalsy();

      await input.setValue('Half');
      await input.trigger('blur', { relatedTarget: document.body });
      expect(wrapper.emitted('addTag')?.[0]).toEqual(['Half']);

      wrapper.unmount();
    });

    it('adds a tag when the delimiter is typed', async () => {
      const wrapper = mountCompactTagsInput();
      const input = wrapper.find('input');

      (input.element as HTMLInputElement).value = 'Nuxt,';
      await input.trigger('input', { data: ',' });

      expect(wrapper.emitted('addTag')?.[0]).toEqual(['Nuxt']);

      wrapper.unmount();
    });

    it('splits and adds multiple tags on paste', async () => {
      const wrapper = mountCompactTagsInput({ addOnPaste: true });
      const input = wrapper.find('input');

      await input.trigger('paste', {
        clipboardData: { getData: () => 'a,b,c' }
      });

      expect(wrapper.emitted('addTag')).toEqual([['a'], ['b'], ['c']]);
      expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toEqual(['Vue', 'TypeScript', 'c']);

      wrapper.unmount();
    });

    it('rejects duplicates by default and emits invalid', async () => {
      const wrapper = mountCompactTagsInput();
      const input = wrapper.find('input');

      await input.setValue('Vue');
      await input.trigger('keydown.enter');

      expect(wrapper.emitted('addTag')).toBeFalsy();
      expect(wrapper.emitted('invalid')?.[0]).toEqual(['Vue']);

      wrapper.unmount();
    });

    it('allows duplicates when duplicate is enabled', async () => {
      const wrapper = mount(
        {
          components: { STagsInput },
          data() {
            return { tags: ['Vue', 'TypeScript'] };
          },
          template: `
            <STagsInput
              v-model="tags"
              duplicate
              :control-props="{ 'aria-label': 'Add tag' }"
              @add-tag="$emit('addTag', $event)"
            />
          `
        },
        { attachTo: document.body }
      );
      const input = wrapper.find('input');

      await input.setValue('Vue');
      await input.trigger('keydown.enter');

      expect(wrapper.emitted('addTag')?.[0]).toEqual(['Vue']);
      expect(wrapper.findAll('[data-vean-tags-input-item]')).toHaveLength(3);

      wrapper.unmount();
    });

    it('enforces max and emits invalid', async () => {
      const wrapper = mountCompactTagsInput({ max: 2 });
      const input = wrapper.find('input');

      await input.setValue('Angular');
      await input.trigger('keydown.enter');

      expect(wrapper.emitted('addTag')).toBeFalsy();
      expect(wrapper.emitted('invalid')?.[0]).toEqual(['Angular']);

      wrapper.unmount();
    });

    it('marks the input readonly in readonly mode but still allows tag removal', async () => {
      const wrapper = mountCompactTagsInput({ readonly: true });

      expect((wrapper.find('input').element as HTMLInputElement).readOnly).toBe(true);

      await wrapper.findAll('[data-vean-tags-input-item-delete]')[0].trigger('click');

      expect(wrapper.emitted('removeTag')?.[0]).toEqual(['Vue']);

      wrapper.unmount();
    });

    it('clears all tags when clear is clicked', async () => {
      const wrapper = mountCompactTagsInput();

      await wrapper.find('[data-vean-tags-input-clear]').trigger('click');

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]]);

      wrapper.unmount();
    });

    it('removes the first tag on delete click without recursive updates', async () => {
      const wrapper = mount(ControlledCompactTagsInput, { attachTo: document.body });

      await wrapper.findAll('[data-vean-tags-input-item-delete]')[0].trigger('click');

      expect(wrapper.text()).not.toContain('Vue');
      expect(wrapper.text()).toContain('React');
      expect(wrapper.text()).toContain('Angular');

      wrapper.unmount();
    });
  });

  describe('keyboard navigation', () => {
    it('removes the last tag with ArrowLeft + Backspace', async () => {
      const wrapper = mountCompactTagsInput();
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'ArrowLeft' });
      await input.trigger('keydown', { key: 'Backspace' });

      expect(wrapper.emitted('removeTag')?.[0]).toEqual(['TypeScript']);

      wrapper.unmount();
    });

    it('deselects the active tag with ArrowRight so Backspace no longer deletes', async () => {
      const wrapper = mountCompactTagsInput();
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'ArrowLeft' });
      await input.trigger('keydown', { key: 'ArrowRight' });
      await input.trigger('keydown', { key: 'Backspace' });

      expect(wrapper.emitted('removeTag')).toBeFalsy();

      wrapper.unmount();
    });

    it('selects the last tag with ArrowRight in RTL (logical left)', async () => {
      const wrapper = mountCompactTagsInput({ dir: 'rtl' });
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'ArrowRight' });
      await input.trigger('keydown', { key: 'Backspace' });

      expect(wrapper.emitted('removeTag')?.[0]).toEqual(['TypeScript']);

      wrapper.unmount();
    });

    it('deselects with ArrowLeft in RTL (logical right)', async () => {
      const wrapper = mountCompactTagsInput({ dir: 'rtl' });
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'ArrowRight' });
      await input.trigger('keydown', { key: 'ArrowLeft' });
      await input.trigger('keydown', { key: 'Backspace' });

      expect(wrapper.emitted('removeTag')).toBeFalsy();

      wrapper.unmount();
    });

    it('deselects the active tag when typing', async () => {
      const wrapper = mountCompactTagsInput();
      const input = wrapper.find('input');

      await input.trigger('keydown', { key: 'ArrowLeft' });
      await input.trigger('keydown', { key: 'a' });
      await input.trigger('keydown', { key: 'Backspace' });

      expect(wrapper.emitted('removeTag')).toBeFalsy();

      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents input interaction when disabled', async () => {
      const wrapper = mountCompactTagsInput({ disabled: true });
      const input = wrapper.find('input');

      expect((input.element as HTMLInputElement).disabled).toBe(true);
      await input.setValue('Blocked');
      await input.trigger('keydown.enter');
      expect(wrapper.emitted('addTag')).toBeFalsy();

      wrapper.unmount();
    });

    it('does not clear when disabled', async () => {
      const wrapper = mountCompactTagsInput({ disabled: true });

      await wrapper.find('[data-vean-tags-input-clear]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();

      wrapper.unmount();
    });

    it('disables item delete buttons and marks items when disabled', () => {
      const wrapper = mountCompactTagsInput({ disabled: true });

      const deleteButton = wrapper.find('[data-vean-tags-input-item-delete]').element as HTMLButtonElement;
      expect(deleteButton.disabled).toBe(true);
      expect(wrapper.find('[data-vean-tags-input-item]').attributes('data-disabled')).toBeDefined();

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mount(
        {
          components: { STagsInput },
          template: `
            <div>
              <label for="test-tags-input">Tags</label>
              <STagsInput id="test-tags-input" clearable :model-value="['Vue', 'TypeScript']" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('wires input aria-controls to the tag list container id', () => {
      const wrapper = mountCompactTagsInput({ id: 'tags-x' });

      expect(wrapper.find('input').attributes('aria-controls')).toBe('tags-x-tags-list');
      expect(wrapper.get('[data-vean-tags-input-root]').attributes('id')).toBe('tags-x-tags-list');

      wrapper.unmount();
    });

    it('overrides the input aria-label via controlProps', () => {
      const wrapper = mountCompactTagsInput({
        controlProps: { 'aria-label': 'Custom add label' }
      });

      expect(wrapper.find('input').attributes('aria-label')).toBe('Custom add label');

      wrapper.unmount();
    });

    it('labels each item via its text element', async () => {
      const wrapper = mountCompactTagsInput();

      await nextTick();
      await flushPromises();

      const item = wrapper.find('[data-vean-tags-input-item]');
      const labelId = item.attributes('aria-labelledby');

      expect(labelId).toBeTruthy();
      expect(wrapper.find(`#${labelId}`).text()).toBe('Vue');

      wrapper.unmount();
    });
  });
});
