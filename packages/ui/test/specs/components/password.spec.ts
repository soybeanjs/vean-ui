import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SPassword from '@/components/password/password.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SPassword', () => {
  describe('rendering', () => {
    it('renders a password input by default', () => {
      const wrapper = mount(SPassword, { attachTo: document.body });

      expect(wrapper.find('input').attributes('type')).toBe('password');

      wrapper.unmount();
    });

    it('marks the root with data-vean-password', () => {
      const wrapper = mount(SPassword, { attachTo: document.body });

      expect(wrapper.find('[data-vean-password]').exists()).toBe(true);

      wrapper.unmount();
    });

    it('passes placeholder attribute', () => {
      const wrapper = mount(SPassword, {
        props: { placeholder: 'Enter password' },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter password');

      wrapper.unmount();
    });

    it('applies the size variant class to the root element', () => {
      const wrapper = mount(SPassword, {
        props: { size: 'lg' },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-input-root]').classes()).toContain('h-9');

      wrapper.unmount();
    });

    it('renders the visible trigger as a plain button that never submits forms', () => {
      const wrapper = mount(SPassword, { attachTo: document.body });

      expect(wrapper.find('[data-vean-password-visible]').attributes('type')).toBe('button');

      wrapper.unmount();
    });

    it('renders leading and trailing slots', () => {
      const wrapper = mount(
        {
          components: { SPassword },
          template: `
            <SPassword>
              <template #leading>@</template>
              <template #trailing>#</template>
            </SPassword>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.text()).toContain('@');
      expect(wrapper.text()).toContain('#');

      wrapper.unmount();
    });
  });

  describe('model value', () => {
    it('reflects modelValue in the input', () => {
      const wrapper = mount(SPassword, {
        props: { modelValue: 's3cret' },
        attachTo: document.body
      });

      expect(wrapper.find('input').element.value).toBe('s3cret');

      wrapper.unmount();
    });

    it('emits update:modelValue when the user types', async () => {
      const wrapper = mount(SPassword, { attachTo: document.body });

      await wrapper.find('input').setValue('typed password');

      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['typed password']);

      wrapper.unmount();
    });

    it('emits an empty string when the clear trigger is clicked', async () => {
      const wrapper = mount(SPassword, {
        props: {
          modelValue: 'abc123',
          clearable: true
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-input-clearable]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['']);

      wrapper.unmount();
    });
  });

  describe('visible state', () => {
    it('toggles the input type and emits update:visible', async () => {
      const wrapper = mount(SPassword, { attachTo: document.body });

      await wrapper.find('[data-vean-password-visible]').trigger('click');

      expect(wrapper.find('input').attributes('type')).toBe('text');
      expect(wrapper.emitted('update:visible')).toBeTruthy();
      expect(wrapper.emitted('update:visible')![0]).toEqual([true]);

      wrapper.unmount();
    });

    it('toggles back to password and emits update:visible false', async () => {
      const wrapper = mount(SPassword, { attachTo: document.body });

      await wrapper.find('[data-vean-password-visible]').trigger('click');
      await wrapper.find('[data-vean-password-visible]').trigger('click');

      expect(wrapper.find('input').attributes('type')).toBe('password');
      expect(wrapper.emitted('update:visible')![1]).toEqual([false]);

      wrapper.unmount();
    });

    it('keeps the typed value when toggling visibility', async () => {
      const wrapper = mount(SPassword, { attachTo: document.body });

      await wrapper.find('input').setValue('keep-me');
      await wrapper.find('[data-vean-password-visible]').trigger('click');

      expect(wrapper.find('input').element.value).toBe('keep-me');
      expect(wrapper.find('input').attributes('type')).toBe('text');

      wrapper.unmount();
    });

    it('updates the visible trigger aria-label and aria-pressed', async () => {
      const wrapper = mount(SPassword, { attachTo: document.body });
      const toggle = wrapper.find('[data-vean-password-visible]');

      expect(toggle.attributes('aria-label')).toBe('Show password');
      expect(toggle.attributes('aria-pressed')).toBe('false');

      await toggle.trigger('click');

      expect(toggle.attributes('aria-label')).toBe('Hide password');
      expect(toggle.attributes('aria-pressed')).toBe('true');

      wrapper.unmount();
    });

    it('supports a controlled visible state driven by the parent', async () => {
      const wrapper = mount(
        {
          components: { SPassword },
          data: () => ({ isVisible: false }),
          template: `
            <SPassword :visible="isVisible" @update:visible="isVisible = $event" />
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('input').attributes('type')).toBe('password');

      await wrapper.find('[data-vean-password-visible]').trigger('click');

      expect(wrapper.find('input').attributes('type')).toBe('text');
      expect(wrapper.find('[data-vean-password-visible]').attributes('aria-pressed')).toBe('true');

      wrapper.unmount();
    });

    it('forwards the visible slot with scoped state', async () => {
      const wrapper = mount(
        {
          components: { SPassword },
          template: `
            <SPassword>
              <template #visible="{ visible, toggle }">
                <button type="button" data-test="toggle" @click="toggle">{{ visible ? 'visible' : 'hidden' }}</button>
              </template>
            </SPassword>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('[data-test="toggle"]').text()).toBe('hidden');

      await wrapper.find('[data-test="toggle"]').trigger('click');

      expect(wrapper.find('[data-test="toggle"]').text()).toBe('visible');

      wrapper.unmount();
    });

    it('starts visible when defaultVisible is true', () => {
      const wrapper = mount(SPassword, {
        props: { defaultVisible: true },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('type')).toBe('text');
      expect(wrapper.find('[data-vean-password-visible]').attributes('aria-pressed')).toBe('true');

      wrapper.unmount();
    });
  });

  describe('autocomplete', () => {
    it('passes current-password through to the input', () => {
      const wrapper = mount(SPassword, {
        props: { autocomplete: 'current-password' },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('autocomplete')).toBe('current-password');

      wrapper.unmount();
    });

    it('passes new-password through to the input', () => {
      const wrapper = mount(SPassword, {
        props: { autocomplete: 'new-password' },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('autocomplete')).toBe('new-password');

      wrapper.unmount();
    });
  });

  describe('clear trigger', () => {
    it('emits clear when the clear trigger is clicked', async () => {
      const wrapper = mount(SPassword, {
        props: { modelValue: 'abc123', clearable: true },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-input-clearable]').trigger('click');

      expect(wrapper.emitted('clear')).toBeTruthy();

      wrapper.unmount();
    });

    it('renders a default i18n aria-label on the clear trigger', () => {
      const wrapper = mount(SPassword, {
        props: { clearable: true },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-input-clearable]').attributes('aria-label')).toBe('Clear input');

      wrapper.unmount();
    });

    it('lets the consumer override the clear trigger aria-label via clearProps', () => {
      const wrapper = mount(SPassword, {
        props: {
          clearable: true,
          clearProps: { 'aria-label': 'Empty the field' }
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-input-clearable]').attributes('aria-label')).toBe('Empty the field');

      wrapper.unmount();
    });
  });

  describe('disabled / readonly state', () => {
    it('disables the input, visible trigger and clear trigger', () => {
      const wrapper = mount(SPassword, {
        props: {
          disabled: true,
          clearable: true
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').element.disabled).toBe(true);
      expect((wrapper.find('[data-vean-password-visible]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.find('[data-vean-input-clearable]').element as HTMLButtonElement).disabled).toBe(true);

      wrapper.unmount();
    });

    it('does not clear or toggle when disabled', async () => {
      const wrapper = mount(SPassword, {
        props: {
          modelValue: 'abc123',
          clearable: true,
          disabled: true
        },
        attachTo: document.body
      });

      await wrapper.find('[data-vean-input-clearable]').trigger('click');
      await wrapper.find('[data-vean-password-visible]').trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeUndefined();
      expect(wrapper.emitted('clear')).toBeUndefined();
      expect(wrapper.emitted('update:visible')).toBeUndefined();

      wrapper.unmount();
    });

    it('passes readonly and disables the visible trigger', () => {
      const wrapper = mount(SPassword, {
        props: {
          readonly: true,
          clearable: true
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('readonly')).toBeDefined();
      expect((wrapper.find('[data-vean-password-visible]').element as HTMLButtonElement).disabled).toBe(true);
      expect((wrapper.find('[data-vean-input-clearable]').element as HTMLButtonElement).disabled).toBe(true);

      wrapper.unmount();
    });
  });

  describe('form proxy', () => {
    it('renders a visually hidden input for form submission when a name is set', () => {
      const wrapper = mount(SPassword, {
        props: { name: 'password' },
        attachTo: document.body
      });

      const hiddenInputs = wrapper.findAll('[data-vean-visually-hidden-input]');
      expect(hiddenInputs).toHaveLength(1);
      expect(hiddenInputs[0].attributes('name')).toBe('password');

      wrapper.unmount();
    });

    it('does not render a visually hidden input without a name', () => {
      const wrapper = mount(SPassword, { attachTo: document.body });

      expect(wrapper.find('[data-vean-visually-hidden-input]').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when paired with a label', async () => {
      const wrapper = mount(
        {
          components: { SPassword },
          template: `
            <div>
              <label for="test-password">Password</label>
              <SPassword id="test-password" clearable />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });

    it('has no a11y violations when the password is revealed', async () => {
      const wrapper = mount(
        {
          components: { SPassword },
          template: `
            <div>
              <label for="test-revealed">Password</label>
              <SPassword id="test-revealed" model-value="abc123" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      await wrapper.find('[data-vean-password-visible]').trigger('click');

      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);

      wrapper.unmount();
    });
  });
});
