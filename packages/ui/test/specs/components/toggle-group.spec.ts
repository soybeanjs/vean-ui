import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { SToggleGroup, SToggleGroupItem } from '@/components/toggle-group';
import { getA11yViolations } from '../../shared/a11y';

function mountToggleGroup(props?: Record<string, unknown>) {
  return mount(SToggleGroup, {
    props,
    slots: {
      default: `
        <SToggleGroupItem value="bold">Bold</SToggleGroupItem>
        <SToggleGroupItem value="italic">Italic</SToggleGroupItem>
        <SToggleGroupItem value="underline" disabled>Underline</SToggleGroupItem>
      `
    },
    global: {
      components: {
        SToggleGroupItem
      }
    },
    attachTo: document.body
  });
}

describe('SToggleGroup', () => {
  describe('rendering', () => {
    it('renders all toggle items', () => {
      const wrapper = mountToggleGroup();
      expect(wrapper.findAll('button')).toHaveLength(3);
      wrapper.unmount();
    });

    it('renders group role and orientation', () => {
      const wrapper = mountToggleGroup({ orientation: 'vertical' });
      expect(wrapper.attributes('role')).toBe('group');
      expect(wrapper.attributes('data-orientation')).toBe('vertical');
      wrapper.unmount();
    });

    it('applies custom class to the group root', () => {
      const wrapper = mountToggleGroup({ class: 'my-group-cls' });
      expect(wrapper.find('[data-vean-toggle-group-root]').classes()).toContain('my-group-cls');
      wrapper.unmount();
    });

    it('falls back to a plain group when rovingFocus is disabled', async () => {
      const wrapper = mountToggleGroup({ rovingFocus: false, modelValue: 'bold' });
      const root = wrapper.find('[data-vean-toggle-group-root]');
      expect(root.attributes('role')).toBe('group');
      expect(root.attributes('data-loop')).toBeUndefined();
      await wrapper.findAll('button')[1].trigger('click');
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('italic');
      wrapper.unmount();
    });
  });

  describe('pressed state', () => {
    it('reflects the selected item via aria-pressed', () => {
      const wrapper = mountToggleGroup({ modelValue: 'bold' });
      const [boldButton, italicButton] = wrapper.findAll('button');
      expect(boldButton.attributes('aria-pressed')).toBe('true');
      expect(italicButton.attributes('aria-pressed')).toBe('false');
      wrapper.unmount();
    });

    it('reflects data-state on and off for items', () => {
      const wrapper = mountToggleGroup({ modelValue: 'bold' });
      const [boldButton, italicButton] = wrapper.findAll('button');
      expect(boldButton.attributes('data-state')).toBe('on');
      expect(italicButton.attributes('data-state')).toBe('off');
      wrapper.unmount();
    });

    it('reflects orientation on items', () => {
      const wrapper = mountToggleGroup({ orientation: 'vertical' });
      expect(wrapper.findAll('button')[0].attributes('data-orientation')).toBe('vertical');
      wrapper.unmount();
    });

    it('emits update:modelValue when an item is clicked', async () => {
      const wrapper = mountToggleGroup({ modelValue: 'bold' });
      await wrapper.findAll('button')[1].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBe('italic');
      wrapper.unmount();
    });

    it('emits an array in multiple mode', async () => {
      const wrapper = mountToggleGroup({ multiple: true, modelValue: ['bold'] });
      await wrapper.findAll('button')[1].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['bold', 'italic']);
      wrapper.unmount();
    });

    it('deselects when clicking the selected item in controlled mode', async () => {
      const wrapper = mountToggleGroup({ modelValue: 'bold' });
      await wrapper.findAll('button')[0].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0][0]).toBeUndefined();
      wrapper.unmount();
    });

    it('removes a value when clicked again in multiple mode', async () => {
      const wrapper = mountToggleGroup({ multiple: true, modelValue: ['bold', 'italic'] });
      await wrapper.findAll('button')[0].trigger('click');
      expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['italic']);
      wrapper.unmount();
    });

    it('supports uncontrolled usage with defaultValue', async () => {
      const wrapper = mountToggleGroup({ defaultValue: 'italic' });
      expect(wrapper.findAll('button')[1].attributes('aria-pressed')).toBe('true');
      await wrapper.findAll('button')[0].trigger('click');
      expect(wrapper.findAll('button')[0].attributes('data-state')).toBe('on');
      expect(wrapper.findAll('button')[1].attributes('data-state')).toBe('off');
      wrapper.unmount();
    });

    it('supports uncontrolled multiple with a defaultValue array', async () => {
      const wrapper = mountToggleGroup({ multiple: true, defaultValue: ['bold'] });
      expect(wrapper.findAll('button')[0].attributes('data-state')).toBe('on');
      await wrapper.findAll('button')[1].trigger('click');
      expect(wrapper.findAll('button')[0].attributes('data-state')).toBe('on');
      expect(wrapper.findAll('button')[1].attributes('data-state')).toBe('on');
      wrapper.unmount();
    });

    it('supports custom numeric values', async () => {
      const wrapper = mount(
        {
          components: { SToggleGroup, SToggleGroupItem },
          data() {
            return { value: 1 };
          },
          template: `
            <SToggleGroup v-model="value">
              <SToggleGroupItem :value="1">One</SToggleGroupItem>
              <SToggleGroupItem :value="2">Two</SToggleGroupItem>
            </SToggleGroup>
          `
        },
        { attachTo: document.body }
      );

      await wrapper.findAll('button')[1].trigger('click');
      expect(wrapper.vm.value).toBe(2);
      wrapper.unmount();
    });
  });

  describe('keyboard interaction', () => {
    it('moves focus with arrow keys via roving focus', async () => {
      const wrapper = mountToggleGroup({ modelValue: 'bold' });
      const buttons = wrapper.findAll('button');

      buttons[0].element.focus();
      await buttons[0].trigger('keydown', { key: 'ArrowRight' });
      expect(document.activeElement).toBe(buttons[1].element);

      await buttons[1].trigger('keydown', { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(buttons[0].element);
      wrapper.unmount();
    });

    it('wraps around to the first focusable item when loop is enabled', async () => {
      const wrapper = mountToggleGroup({ modelValue: 'bold' });
      const buttons = wrapper.findAll('button');

      // underline item is disabled, so ArrowRight from italic wraps to bold
      buttons[1].element.focus();
      await buttons[1].trigger('keydown', { key: 'ArrowRight' });
      expect(document.activeElement).toBe(buttons[0].element);
      wrapper.unmount();
    });

    it('reverses arrow direction in RTL and reflects dir attribute', async () => {
      const wrapper = mountToggleGroup({ dir: 'rtl', modelValue: 'bold' });
      expect(wrapper.attributes('dir')).toBe('rtl');

      const buttons = wrapper.findAll('button');
      buttons[0].element.focus();
      await buttons[0].trigger('keydown', { key: 'ArrowRight' });
      expect(document.activeElement).toBe(buttons[1].element);
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('prevents interaction when the whole group is disabled', async () => {
      const wrapper = mountToggleGroup({ disabled: true, modelValue: 'bold' });
      await wrapper.findAll('button')[1].trigger('click');
      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('marks disabled items with native disabled attribute', () => {
      const wrapper = mountToggleGroup();
      expect(wrapper.findAll('button')[2].attributes('disabled')).toBe('');
      wrapper.unmount();
    });

    it('marks the root with data-disabled and disables every item', () => {
      const wrapper = mountToggleGroup({ disabled: true });
      expect(wrapper.find('[data-vean-toggle-group-root]').attributes('data-disabled')).toBeDefined();
      wrapper.findAll('button').forEach(button => {
        expect(button.attributes('disabled')).toBeDefined();
      });
      wrapper.unmount();
    });
  });

  describe('ui overrides', () => {
    it('applies ui.item class overrides', () => {
      const wrapper = mountToggleGroup({ ui: { item: 'my-item-cls' } });
      expect(wrapper.findAll('button')[0].classes()).toContain('my-item-cls');
      wrapper.unmount();
    });
  });

  describe('slot props', () => {
    it('exposes pressed and disabled state to the item slot', () => {
      const wrapper = mount(SToggleGroup, {
        props: { modelValue: 'bold' },
        slots: {
          default:
            '<SToggleGroupItem value="bold"><template #default="{ pressed, disabled }">{{ pressed }}-{{ disabled }}</template></SToggleGroupItem>'
        },
        global: {
          components: {
            SToggleGroupItem
          }
        },
        attachTo: document.body
      });

      expect(wrapper.text()).toContain('true-false');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations', async () => {
      const wrapper = mountToggleGroup({ modelValue: 'bold' });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations in vertical multiple mode', async () => {
      const wrapper = mountToggleGroup({
        orientation: 'vertical',
        multiple: true,
        modelValue: ['bold', 'italic']
      });
      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
