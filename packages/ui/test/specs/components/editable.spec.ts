import { describe, expect, it } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import SEditable from '@/components/editable/editable.vue';
import { getA11yViolations } from '../../shared/a11y';

/**
 * 模拟真实浏览器中的焦点移动：input blur 后焦点落到根外部元素，
 * 触发 document `focusin`（useFocusOutside 依赖它）→ handleDismiss → submit/cancel。
 * 直接用 `trigger('blur')` 在 happy-dom 中不会移动焦点，属测试伪影。
 */
async function moveFocusOutside() {
  const outside = document.createElement('button');
  document.body.appendChild(outside);
  outside.focus();
  await nextTick();
  outside.remove();
}

describe('SEditable', () => {
  describe('rendering', () => {
    it('renders preview content', () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'Editable value' },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('Editable value');

      wrapper.unmount();
    });

    it('shows the preview placeholder when empty', () => {
      const wrapper = mount(SEditable, {
        props: { placeholder: 'Empty preview' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-editable-preview]').text()).toBe('Empty preview');
      wrapper.unmount();
    });

    it('applies custom class to root element', () => {
      const wrapper = mount(SEditable, {
        props: { class: 'my-editable' },
        attachTo: document.body
      });

      expect(wrapper.html()).toContain('my-editable');

      wrapper.unmount();
    });

    it('renders root data attributes in preview state', () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'value' },
        attachTo: document.body
      });

      const root = wrapper.find('[data-vean-editable-root]');

      expect(root.exists()).toBe(true);
      expect(root.attributes('data-state')).toBe('preview');
      expect(root.attributes('data-disabled')).toBeUndefined();
      expect(root.attributes('data-readonly')).toBeUndefined();
      wrapper.unmount();
    });

    it('renders area/preview data attributes', () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'value' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-editable-area]').attributes('data-empty')).toBeUndefined();
      expect(wrapper.find('[data-vean-editable-preview]').attributes('data-placeholder-shown')).toBeUndefined();
      expect(wrapper.find('[data-vean-editable-input]').exists()).toBe(true);
      wrapper.unmount();
    });

    it('applies the root id to the input element', async () => {
      const wrapper = mount(SEditable, {
        props: { id: 'editable-input', startWithEditMode: true },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('id')).toBe('editable-input');

      wrapper.unmount();
    });

    it('does not leak as / asChild to the DOM', () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'value' },
        attachTo: document.body
      });

      const html = wrapper.html();

      expect(html).not.toContain('aschild');
      expect(html).not.toMatch(/as="/);
      wrapper.unmount();
    });
  });

  describe('editing state', () => {
    it('enters edit mode on focus by default', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'Editable value' },
        attachTo: document.body
      });

      const preview = wrapper.find('span[tabindex="0"]');

      await preview.trigger('focusin');
      await nextTick();

      expect(wrapper.find('input').element.hidden).toBe(false);
      expect(wrapper.find('[data-vean-editable-root]').attributes('data-state')).toBe('edit');
      expect(wrapper.emitted('update:state')?.[0]).toEqual(['edit']);

      wrapper.unmount();
    });

    it('supports double click activation mode', async () => {
      const wrapper = mount(SEditable, {
        props: { activationMode: 'dblclick', defaultValue: 'Editable value' },
        attachTo: document.body
      });

      const preview = wrapper.find('span[tabindex="0"]');
      const input = wrapper.find('input');

      await preview.trigger('focusin');
      expect(input.element.hidden).toBe(true);

      await preview.trigger('dblclick');
      await nextTick();

      expect(input.element.hidden).toBe(false);

      wrapper.unmount();
    });

    it('does not enter edit mode on focus when activationMode is none', async () => {
      const wrapper = mount(SEditable, {
        props: { activationMode: 'none', defaultValue: 'Editable value' },
        attachTo: document.body
      });

      const preview = wrapper.find('span[tabindex="0"]');

      await preview.trigger('focusin');
      await nextTick();

      expect(wrapper.find('input').element.hidden).toBe(true);

      // none 模式仍可经 edit trigger 编程进入编辑
      await wrapper.find('[data-vean-editable-edit-trigger]').trigger('click');
      await nextTick();

      expect(wrapper.find('input').element.hidden).toBe(false);

      wrapper.unmount();
    });

    it('renders the input visible on mount with startWithEditMode', () => {
      const wrapper = mount(SEditable, {
        props: { startWithEditMode: true, defaultValue: 'Editable value' },
        attachTo: document.body
      });

      expect(wrapper.find('input').element.hidden).toBe(false);
      expect((wrapper.find('[data-vean-editable-preview]').element as HTMLElement).hidden).toBe(true);

      wrapper.unmount();
    });

    it('blocks editing when readonly', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'a', readonly: true },
        attachTo: document.body
      });

      const preview = wrapper.find('[data-vean-editable-preview]');

      await preview.trigger('focusin');
      await nextTick();

      expect(wrapper.find('input').element.hidden).toBe(true);
      expect(preview.attributes('data-readonly')).toBeDefined();

      wrapper.unmount();
    });

    it('selects the input content when selectOnFocus', async () => {
      const wrapper = mount(SEditable, {
        props: { startWithEditMode: true, selectOnFocus: true, defaultValue: 'select me' },
        attachTo: document.body
      });

      const input = wrapper.find('input').element as HTMLInputElement;

      expect(input.selectionStart).toBe(0);
      expect(input.selectionEnd).toBe('select me'.length);

      wrapper.unmount();
    });
  });

  describe('model value and events', () => {
    it('submits on enter and emits changes', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'Editable value', submitMode: 'enter' },
        attachTo: document.body
      });

      const preview = wrapper.find('span[tabindex="0"]');

      await preview.trigger('focusin');
      await nextTick();

      const input = wrapper.find('input');

      await input.setValue('Updated value');
      await input.trigger('keydown', { key: 'Enter' });

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Updated value']);
      expect(wrapper.emitted('submit')?.[0]).toEqual(['Updated value']);
      expect(wrapper.emitted('update:state')?.at(-1)).toEqual(['submit']);
      expect(input.element.hidden).toBe(true);

      wrapper.unmount();
    });

    it('does not submit on shift+enter', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'Editable value', submitMode: 'both' },
        attachTo: document.body
      });

      const preview = wrapper.find('span[tabindex="0"]');
      await preview.trigger('focusin');
      await nextTick();

      const input = wrapper.find('input');

      await input.setValue('Updated value');
      await input.trigger('keydown', { key: 'Enter', shiftKey: true });

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('submit')).toBeFalsy();

      wrapper.unmount();
    });

    it('cancels on escape without emitting value changes', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'Editable value' },
        attachTo: document.body
      });

      const preview = wrapper.find('span[tabindex="0"]');

      await preview.trigger('focusin');
      await nextTick();

      const input = wrapper.find('input');

      await input.setValue('Updated value');
      await input.trigger('keydown', { key: 'Escape' });
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('update:state')?.at(-1)).toEqual(['cancel']);
      expect(input.element.hidden).toBe(true);

      wrapper.unmount();
    });

    it('submits on blur by default (submitMode blur)', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'a', startWithEditMode: true },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('b');
      await moveFocusOutside();

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b']);
      expect(wrapper.emitted('submit')?.[0]).toEqual(['b']);

      wrapper.unmount();
    });

    it('cancels on blur when submitMode is none', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'a', startWithEditMode: true, submitMode: 'none' },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('b');
      await moveFocusOutside();

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('update:state')?.[0]).toEqual(['cancel']);

      wrapper.unmount();
    });

    it('keeps in-progress input when a controlled update lands while editing', async () => {
      const value = ref('a');
      const Parent = defineComponent({
        setup() {
          return { value };
        },
        render() {
          return h(SEditable, {
            modelValue: this.value,
            'onUpdate:modelValue': (v: string) => (value.value = v),
            startWithEditMode: true,
            submitMode: 'enter'
          });
        }
      });

      const wrapper = mount(Parent, { attachTo: document.body });
      const input = wrapper.find('input');

      await input.setValue('user typing...');
      value.value = 'external';
      await nextTick();

      expect((input.element as HTMLInputElement).value).toBe('user typing...');

      // 非编辑态的外部更新仍会同步（提交后回显）
      await input.trigger('keydown', { key: 'Enter' });
      expect(value.value).toBe('user typing...');
      value.value = 'external';
      await nextTick();
      expect((wrapper.find('[data-vean-editable-preview]').element as HTMLElement).textContent).toContain('external');

      wrapper.unmount();
    });

    it('submits via the submit trigger button', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'a', startWithEditMode: true, submitMode: 'none' },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('b');
      await wrapper.find('[data-vean-editable-submit-trigger]').trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b']);
      expect(wrapper.emitted('submit')?.[0]).toEqual(['b']);

      wrapper.unmount();
    });

    it('cancels via the cancel trigger button', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'a', startWithEditMode: true, submitMode: 'none' },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('b');
      await wrapper.find('[data-vean-editable-cancel-trigger]').trigger('click');
      await nextTick();

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.find('input').element.hidden).toBe(true);

      wrapper.unmount();
    });
  });

  describe('props forwarding and slots', () => {
    it('allows overriding trigger aria-labels', async () => {
      const wrapper = mount(SEditable, {
        props: {
          editTriggerProps: { 'aria-label': 'Rename' },
          submitTriggerProps: { 'aria-label': 'Save changes' },
          cancelTriggerProps: { 'aria-label': 'Discard changes' }
        },
        attachTo: document.body
      });

      expect(wrapper.find('button[aria-label="Rename"]').exists()).toBe(true);

      await wrapper.find('button[aria-label="Rename"]').trigger('click');
      await nextTick();

      expect(wrapper.find('button[aria-label="Save changes"]').exists()).toBe(true);
      expect(wrapper.find('button[aria-label="Discard changes"]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('forwards previewProps / areaProps / inputProps data attributes', async () => {
      const wrapper = mount(SEditable, {
        props: {
          defaultValue: 'a',
          areaProps: { 'data-probe': 'area-probe' },
          previewProps: { 'data-probe': 'preview-probe' },
          inputProps: { 'data-probe': 'input-probe' }
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-editable-area]').attributes('data-probe')).toBe('area-probe');
      expect(wrapper.find('[data-vean-editable-preview]').attributes('data-probe')).toBe('preview-probe');
      expect(wrapper.find('[data-vean-editable-input]').attributes('data-probe')).toBe('input-probe');

      wrapper.unmount();
    });

    it('supports custom preview / input slots', async () => {
      const wrapper = mount(
        {
          components: { SEditable },
          template: `
            <SEditable defaultValue="a">
              <template #preview>Custom preview</template>
              <template #input="{ isEditing }">Custom input {{ isEditing }}</template>
            </SEditable>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.text()).toContain('Custom preview');

      // 自定义 preview 无默认 tabindex 交互，经 edit trigger 进入编辑
      await wrapper.find('[data-vean-editable-edit-trigger]').trigger('click');
      await nextTick();

      expect(wrapper.text()).toContain('Custom input true');

      wrapper.unmount();
    });

    it('forwards maxLength to the input', async () => {
      const wrapper = mount(SEditable, {
        props: { maxLength: 10, startWithEditMode: true },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('maxlength')).toBe('10');

      wrapper.unmount();
    });

    it('supports object placeholders for preview and edit states', async () => {
      const wrapper = mount(SEditable, {
        props: {
          placeholder: { preview: 'Click to edit', edit: 'Type here' },
          startWithEditMode: true
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('placeholder')).toBe('Type here');
      expect(wrapper.find('[data-vean-editable-preview]').text()).toBe('Click to edit');

      wrapper.unmount();
    });

    it('applies the size variants to the area and triggers', async () => {
      const wrapper = mount(SEditable, {
        props: { size: 'xs', startWithEditMode: true },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-editable-area]').classes()).toContain('h-6');
      expect(wrapper.find('[data-vean-editable-area]').classes()).toContain('text-2xs');
      expect(wrapper.find('[data-vean-editable-submit-trigger]').classes()).toContain('p-0.75');
      expect(wrapper.find('[data-vean-editable-submit-trigger]').classes()).toContain('w-fit');

      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents editing when disabled', async () => {
      const wrapper = mount(SEditable, {
        props: { defaultValue: 'Editable value', disabled: true },
        attachTo: document.body
      });

      const preview = wrapper.find('span[tabindex="-1"]');
      const editTrigger = wrapper.find('button[aria-label="Edit"]');

      await preview.trigger('focusin');
      await nextTick();

      expect(wrapper.find('input').element.hidden).toBe(true);
      expect((editTrigger.element as HTMLButtonElement).disabled).toBe(true);
      expect(wrapper.find('[data-vean-editable-root]').attributes('data-disabled')).toBeDefined();

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations in preview state when paired with a label', async () => {
      const wrapper = mount(
        {
          components: { SEditable },
          template: `
            <div>
              <label for="editable-input">Display name</label>
              <SEditable id="editable-input" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations in edit state when paired with a label', async () => {
      const wrapper = mount(
        {
          components: { SEditable },
          template: `
            <div>
              <label for="editable-input">Display name</label>
              <SEditable id="editable-input" start-with-edit-mode />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
