import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SInputOtp from '@/components/input-otp/input-otp.vue';
import { getA11yViolations } from '../../shared/a11y';

describe('SInputOtp', () => {
  describe('rendering', () => {
    it('renders slots based on maxlength', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 6,
          placeholder: '123456',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.findAll('[data-vean-input-otp-slot]')).toHaveLength(6);
      expect(
        wrapper
          .findAll('[data-vean-input-otp-placeholder]')
          .map(node => node.text())
          .join('')
      ).toBe('123456');
      wrapper.unmount();
    });

    it('renders typed characters inside the visual slots', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          modelValue: '12',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      const chars = wrapper.findAll('[data-vean-input-otp-char]');

      expect(chars).toHaveLength(2);
      expect(chars.map(node => node.text()).join('')).toBe('12');
      wrapper.unmount();
    });

    it('applies custom class to the root container', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          class: 'my-input-otp',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.html()).toContain('my-input-otp');
      wrapper.unmount();
    });

    it('applies the size variant class to the visual slots', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          size: 'lg',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-input-otp-slot]').classes()).toContain('h-11');
      wrapper.unmount();
    });

    it('applies a faded idle surface to unfilled slots', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          placeholder: '0000',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-input-otp-slot]').classes()).toContain('border-input');
      expect(wrapper.find('[data-vean-input-otp-placeholder]').classes()).toContain('text-muted-foreground/45');
      wrapper.unmount();
    });

    it('applies the align variant class to the native input', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          align: 'center',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.find('[data-vean-input-otp-input]').classes()).toContain('text-center');
      wrapper.unmount();
    });

    it('marks the root as focused when the native input receives focus', async () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      await wrapper.find('input').trigger('focus');

      expect(wrapper.find('[data-vean-input-otp-root]').attributes('data-focused')).toBeDefined();
      expect(wrapper.emitted('focus')).toBeTruthy();
      wrapper.unmount();
    });
  });

  describe('attributes', () => {
    it('falls back to a default accessible label', () => {
      const wrapper = mount(SInputOtp, {
        props: { maxlength: 4 },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('aria-label')).toBe('One-time password');
      wrapper.unmount();
    });

    it('forwards a custom accessible label to the native input', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('aria-label')).toBe('Verification code');
      wrapper.unmount();
    });

    it('forwards a custom accessible label passed as a template attribute', () => {
      const wrapper = mount(
        {
          components: { SInputOtp },
          template: `
            <div>
              <SInputOtp :maxlength="4" aria-label="Verification code" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      expect(wrapper.find('input').attributes('aria-label')).toBe('Verification code');
      wrapper.unmount();
    });

    it('forwards a custom accessible label passed as a camelCase prop', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          ariaLabel: 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('aria-label')).toBe('Verification code');
      wrapper.unmount();
    });

    it('forwards name for native form submission', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          name: 'code',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('name')).toBe('code');
      wrapper.unmount();
    });

    it('forwards inputmode, maxlength and pattern to the native input', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 6,
          inputmode: 'text',
          pattern: '^\\d+$',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });
      const input = wrapper.find('input');

      expect(input.attributes('inputmode')).toBe('text');
      expect(input.attributes('maxlength')).toBe('6');
      expect(input.attributes('pattern')).toBe('^\\d+$');
      wrapper.unmount();
    });

    it('forward placeholder to the native input', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          placeholder: '____',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect(wrapper.find('input').attributes('placeholder')).toBe('____');
      wrapper.unmount();
    });
  });

  describe('model value', () => {
    it('reflects the controlled modelValue', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          modelValue: '12',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('12');
      wrapper.unmount();
    });

    it('updates from the uncontrolled default value', () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          defaultValue: '34',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('34');
      wrapper.unmount();
    });

    it('clamps input to maxlength and emits input before complete', async () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      await wrapper.find('input').setValue('123456');

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['1234']);
      expect(wrapper.emitted('input')?.at(-1)).toEqual(['1234']);
      expect(wrapper.emitted('complete')?.[0]).toEqual(['1234']);
      wrapper.unmount();
    });

    it('rejects values that do not match the pattern', async () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          pattern: '^\\d+$',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      const input = wrapper.find('input');
      (input.element as HTMLInputElement).value = '12ab';
      await input.trigger('input');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect((input.element as HTMLInputElement).value).toBe('');
      wrapper.unmount();
    });

    it('prevents invalid beforeinput insertion', async () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          pattern: '^\\d+$',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      const input = wrapper.find('input').element as HTMLInputElement;

      input.dispatchEvent(
        new InputEvent('beforeinput', {
          inputType: 'insertText',
          data: 'a',
          bubbles: true,
          cancelable: true
        })
      );

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('applies pasteTransformer to pasted content', async () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          pasteTransformer: pasted => pasted?.replace(/[^0-9]/g, '') ?? '',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      await wrapper.find('input').trigger('paste', {
        clipboardData: {
          getData: () => '1a2b'
        }
      });

      expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['12']);
      expect((wrapper.find('input').element as HTMLInputElement).value).toBe('12');
      wrapper.unmount();
    });
  });

  describe('disabled state', () => {
    it('keeps the native input disabled and ignores updates', async () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          disabled: true,
          modelValue: '12',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      const input = wrapper.find('input');
      expect((input.element as HTMLInputElement).disabled).toBe(true);
      expect(wrapper.find('[data-vean-input-otp-root]').attributes('data-disabled')).toBeDefined();

      (input.element as HTMLInputElement).value = '9999';
      await input.trigger('input');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      wrapper.unmount();
    });

    it('keeps the native input readonly and ignores updates', async () => {
      const wrapper = mount(SInputOtp, {
        props: {
          maxlength: 4,
          readonly: true,
          modelValue: '12',
          'aria-label': 'Verification code'
        },
        attachTo: document.body
      });

      const input = wrapper.find('input');
      expect(input.attributes('readonly')).toBeDefined();

      (input.element as HTMLInputElement).value = '9999';
      await input.trigger('input');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect((input.element as HTMLInputElement).value).toBe('12');
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('has no a11y violations when it has an accessible name', async () => {
      const wrapper = mount(
        {
          components: { SInputOtp },
          template: `
            <div>
              <SInputOtp :maxlength="6" aria-label="Verification code" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations with the default accessible name', async () => {
      const wrapper = mount(
        {
          components: { SInputOtp },
          template: `
            <div>
              <SInputOtp :maxlength="6" />
            </div>
          `
        },
        { attachTo: document.body }
      );

      const violations = await getA11yViolations(wrapper.element);
      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });

    it('has no a11y violations in the disabled state', async () => {
      const wrapper = mount(
        {
          components: { SInputOtp },
          template: `
            <div>
              <SInputOtp :maxlength="6" disabled aria-label="Verification code" />
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
