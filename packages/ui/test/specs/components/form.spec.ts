import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, nextTick, ref } from 'vue';
import type { Ref } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { z } from 'zod';
import type { FormFieldValidate } from '@vean/aria/form';
import SFormFieldBase from '@/components/form/form-field-base.vue';
import SForm from '@/components/form/form.vue';
import { useForm } from '@/components/form/use-form';
import SInput from '@/components/input/input.vue';
import { getA11yViolations } from '../../shared/a11y';

type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

const probeSchema = z.object({ name: z.string(), count: z.number() });

const schema = z.object({
  username: z.string().nonempty('Username is required'),
  age: z.coerce.number('Age is required').min(18, 'Age must be at least 18'),
  emails: z.array(z.string().email('Email is invalid')).min(1, 'At least one email is required').optional()
});

type HarnessOptions = {
  defaultValues?: Record<string, unknown>;
  validate?: FormFieldValidate<any> | Ref<FormFieldValidate<any>>;
  onSubmitDelay?: number;
  formOptions?: Record<string, unknown>;
};

/** 完整字段表单（校验 + 提交捕获） */
function mountFieldForm(options: HarnessOptions = {}) {
  const submitted = ref<any[]>([]);
  const invalidErrors = ref<Record<string, string> | null>(null);
  let isSubmitting: Ref<boolean> | undefined;
  let form: any;

  const Form = defineComponent({
    setup() {
      const {
        handleSubmit,
        handleReset,
        SFormField,
        isSubmitting: submitting,
        form: formApi
      } = useForm({
        schema,
        defaultValues: options.defaultValues as any,
        validateOnMounted: false,
        ...(options.formOptions ? { formOptions: options.formOptions as any } : {}),
        onSubmit: async (values: any) => {
          if (options.onSubmitDelay) {
            await new Promise(resolve => setTimeout(resolve, options.onSubmitDelay));
          }
          submitted.value.push(values);
        },
        onInvalid: (errors: any) => {
          invalidErrors.value = errors;
        }
      });
      isSubmitting = submitting;
      form = formApi;
      return { handleSubmit, handleReset, SFormField };
    },
    render() {
      return h(
        SForm,
        { onSubmit: this.handleSubmit, onReset: this.handleReset },
        {
          default: () => [
            h(
              this.SFormField,
              {
                name: 'username',
                label: 'Username',
                description: 'Enter your username',
                validate: options.validate
              },
              { default: () => h(SInput, { placeholder: 'username' }) }
            ),
            h(
              this.SFormField,
              { name: 'age', label: 'Age' },
              { default: () => h(SInput, { type: 'number', placeholder: 'age' }) }
            ),
            h(SFormFieldBase, { class: 'submit-row' }, { default: () => h('button', { type: 'submit' }, 'Submit') })
          ]
        }
      );
    }
  });

  const wrapper = mount(Form, { attachTo: document.body });

  return { wrapper, submitted, invalidErrors, isSubmitting, form };
}

/** 数组字段表单 */
function mountArrayForm(options: HarnessOptions = {}) {
  const Form = defineComponent({
    setup() {
      const { handleSubmit, SFormField, SFormFieldArray } = useForm({
        schema,
        defaultValues: (options.defaultValues || { emails: ['a@example.com'] }) as any,
        onSubmit: async () => {}
      });
      return { handleSubmit, SFormField, SFormFieldArray };
    },
    render() {
      return h(
        SForm,
        { onSubmit: this.handleSubmit },
        {
          default: () => [
            h(
              this.SFormFieldArray,
              {
                name: 'emails',
                label: 'Emails',
                class: 'emails-array',
                'data-probe': 'array-root'
              },
              {
                label: (props: any) => h('span', { 'data-test': 'array-label' }, `Emails (${props.fields.length})`),
                default: (props: any) => [
                  props.fields.map((field: any, index: number) =>
                    h('div', { key: index, 'data-test': 'array-item', 'data-key': field.key }, [
                      h(SInput, { placeholder: `Email ${index + 1}` }),
                      h('button', { type: 'button', onClick: () => props.remove(index) }, 'Remove')
                    ])
                  ),
                  h('button', { type: 'button', 'data-test': 'append-btn', onClick: () => props.append('') }, 'Append')
                ]
              }
            ),
            h(SFormFieldBase, {}, { default: () => h('button', { type: 'submit' }, 'Submit') })
          ]
        }
      );
    }
  });

  return mount(Form, { attachTo: document.body });
}

async function submitForm(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('form').trigger('submit');
  // Schema 和字段级 validator 走引擎的异步槽（带 debounce setTimeout），提交生命周期
  // 跨真实宏任务，断言前需先刷定时器。
  await new Promise(resolve => setTimeout(resolve, 10));
  await flushPromises();
  await nextTick();
}

/**
 * 模拟「先输入再清空」：对未受控的 SInput 直接 setValue('') 是 no-op（值未变化不触发
 * update:modelValue），必须先写入非空值再清空才能把空字符串同步到表单状态。
 */
async function clearInput(wrapper: ReturnType<typeof mount>, selector: string) {
  await wrapper.find(selector).setValue('x');
  await wrapper.find(selector).setValue('');
}

describe('SForm', () => {
  describe('rendering', () => {
    it('renders a form element with data attributes', () => {
      const { wrapper } = mountFieldForm();
      const form = wrapper.find('form');

      expect(form.exists()).toBe(true);
      expect(form.attributes('data-vean-form')).toBeDefined();
      expect(form.attributes('data-orientation')).toBe('vertical');
      wrapper.unmount();
    });

    it('renders the field structure (label / description / control)', () => {
      const { wrapper } = mountFieldForm();

      expect(wrapper.find('[data-vean-form-label]').text()).toBe('Username');
      expect(wrapper.find('[data-vean-form-description]').text()).toBe('Enter your username');
      expect(wrapper.find('[data-vean-form-control]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-form-field]').attributes('data-field-type')).toBe('field');
      wrapper.unmount();
    });

    it('applies custom classes to the form and field wrapper', () => {
      const { wrapper } = mountFieldForm();

      expect(wrapper.find('form').classes()).toContain('grid');
      expect(wrapper.find('[data-vean-form-field]').classes()).toContain('group');
      wrapper.unmount();
    });

    it('does not leak name / validate to the field wrapper DOM', () => {
      const { wrapper } = mountFieldForm({
        validate: value => (value ? undefined : 'custom error')
      });
      const attrs = wrapper.find('[data-vean-form-field]').attributes();

      expect(attrs.name).toBeUndefined();
      expect(attrs.validate).toBeUndefined();
      wrapper.unmount();
    });

    it('renders the array field wrapper when isFieldArray', () => {
      const wrapper = mountArrayForm();

      expect(wrapper.find('[data-vean-form-field-array]').exists()).toBe(true);
      expect(wrapper.find('[data-vean-form-field-array]').attributes('data-field-type')).toBe('array');
      wrapper.unmount();
    });

    it('applies the class prop of SFormFieldArray to the array wrapper', () => {
      const wrapper = mountArrayForm();

      expect(wrapper.find('[data-vean-form-field-array]').classes()).toContain('emails-array');
      wrapper.unmount();
    });
  });

  describe('props forwarding', () => {
    it('forwards controlProps to the control element', () => {
      const Form = defineComponent({
        setup() {
          const { handleSubmit, SFormField } = useForm({ schema, onSubmit: async () => {} });
          return { handleSubmit, SFormField };
        },
        render() {
          return h(
            SForm,
            { onSubmit: this.handleSubmit },
            {
              default: () => [
                h(
                  this.SFormField,
                  {
                    name: 'username',
                    label: 'Username',
                    controlProps: { 'data-probe': 'ctrl', id: 'ctrl-probe' }
                  },
                  { default: () => h(SInput) }
                )
              ]
            }
          );
        }
      });

      const wrapper = mount(Form);
      const control = wrapper.find('[data-vean-form-control]');

      expect(control.attributes('data-probe')).toBe('ctrl');
      expect(control.attributes('id')).toBe('ctrl-probe');
      wrapper.unmount();
    });

    it('forwards labelProps data attributes to the label', () => {
      const Form = defineComponent({
        setup() {
          const { handleSubmit, SFormField } = useForm({ schema, onSubmit: async () => {} });
          return { handleSubmit, SFormField };
        },
        render() {
          return h(
            SForm,
            { onSubmit: this.handleSubmit },
            {
              default: () => [
                h(
                  this.SFormField,
                  {
                    name: 'username',
                    label: 'Username',
                    labelProps: { 'data-probe': 'label-probe' }
                  },
                  { default: () => h(SInput) }
                )
              ]
            }
          );
        }
      });

      const wrapper = mount(Form);

      expect(wrapper.find('[data-vean-form-label]').attributes('data-probe')).toBe('label-probe');
      wrapper.unmount();
    });

    it('forwards advanced TanStack options via formOptions', () => {
      const { wrapper, form } = mountFieldForm({ formOptions: { formId: 'spec-form' } });

      expect(form.formId).toBe('spec-form');
      wrapper.unmount();
    });

    it('forwards slot props through SFormFieldBase', async () => {
      let receivedProps: any = null;
      const Form = defineComponent({
        setup() {
          const { handleSubmit } = useForm({ schema, onSubmit: async () => {} });
          return { handleSubmit };
        },
        render() {
          return h(
            SForm,
            { onSubmit: this.handleSubmit },
            {
              default: () => [
                h(
                  SFormFieldBase,
                  {},
                  {
                    default: (props: any) => {
                      receivedProps = props;
                      return h(SInput);
                    }
                  }
                )
              ]
            }
          );
        }
      });

      mount(Form);
      await nextTick();

      expect(receivedProps).toBeTruthy();
      expect(receivedProps.formFieldId).toMatch(/^form-field-/);
      expect(receivedProps.ariaDescribedBy).toMatch(/^form-field-description-/);
      expect(receivedProps.ariaInvalid).toBe(false);
    });
  });

  describe('model value and validation', () => {
    it('submits valid values to onSubmit', async () => {
      const { wrapper, submitted } = mountFieldForm();

      await wrapper.find('input[placeholder="username"]').setValue('soybean');
      await wrapper.find('input[placeholder="age"]').setValue(18);
      await submitForm(wrapper);

      expect(submitted.value).toEqual([{ username: 'soybean', age: '18' }]);
      wrapper.unmount();
    });

    it('rejects invalid values on submit and calls onInvalid', async () => {
      const { wrapper, invalidErrors } = mountFieldForm();

      await clearInput(wrapper, 'input[placeholder="username"]');
      await wrapper.find('input[placeholder="age"]').setValue(10);
      await submitForm(wrapper);

      expect(invalidErrors.value).not.toBeNull();
      expect(invalidErrors.value?.['username']).toBe('Username is required');
      expect(invalidErrors.value?.['age']).toBe('Age must be at least 18');
      wrapper.unmount();
    });

    it('renders the field error and marks the field with data-error', async () => {
      const { wrapper } = mountFieldForm();

      await clearInput(wrapper, 'input[placeholder="username"]');
      await submitForm(wrapper);

      expect(wrapper.find('[data-vean-form-error]').text()).toBe('Username is required');
      expect(wrapper.find('[data-vean-form-field]').attributes('data-error')).toBeDefined();
      wrapper.unmount();
    });

    it('clears the field error after the value becomes valid', async () => {
      const { wrapper } = mountFieldForm();

      await clearInput(wrapper, 'input[placeholder="username"]');
      await submitForm(wrapper);
      expect(wrapper.find('[data-vean-form-error]').exists()).toBe(true);

      await wrapper.find('input[placeholder="username"]').setValue('soybean');
      await wrapper.find('input[placeholder="age"]').setValue(18);
      await submitForm(wrapper);

      expect(wrapper.find('[data-vean-form-error]').exists()).toBe(false);
      wrapper.unmount();
    });

    it('uses the field-level validate function', async () => {
      const { wrapper, invalidErrors } = mountFieldForm({
        validate: value => (String(value).length >= 3 ? undefined : 'Too short')
      });

      await wrapper.find('input[placeholder="username"]').setValue('ab');
      await wrapper.find('input[placeholder="age"]').setValue(18);
      await submitForm(wrapper);

      expect(invalidErrors.value?.['username']).toBe('Too short');
      wrapper.unmount();
    });

    it('runs field-level validators alongside the schema on submit', async () => {
      const { wrapper, invalidErrors } = mountFieldForm({
        validate: value => (value ? undefined : 'custom required')
      });

      await wrapper.find('input[placeholder="age"]').setValue(18);
      await submitForm(wrapper);

      expect(invalidErrors.value?.['username']).toBe('custom required');
      wrapper.unmount();
    });

    it('supports async field-level validation', async () => {
      const { wrapper, invalidErrors } = mountFieldForm({
        validate: value =>
          new Promise<string | undefined>(resolve => {
            setTimeout(() => resolve(value === 'taken' ? 'Taken' : undefined), 10);
          })
      });

      await wrapper.find('input[placeholder="username"]').setValue('taken');
      await wrapper.find('input[placeholder="age"]').setValue(18);
      await submitForm(wrapper);

      // 同为定时器竞态：睡 15ms 等一个 10ms 的校验器只剩 5ms 余量，改为轮询。
      await vi.waitFor(() => expect(invalidErrors.value?.['username']).toBe('Taken'));
      wrapper.unmount();
    });

    it('invokes an async field-level validator once per submit', async () => {
      let calls = 0;
      const { wrapper, submitted } = mountFieldForm({
        validate: value =>
          new Promise<string | undefined>(resolve => {
            calls += 1;
            setTimeout(() => resolve(String(value).length >= 3 ? undefined : 'Too short'), 5);
          })
      });

      await wrapper.find('input[placeholder="username"]').setValue('soybean');
      await wrapper.find('input[placeholder="age"]').setValue(18);
      await submitForm(wrapper);

      expect(calls).toBe(1);
      await vi.waitFor(() => expect(submitted.value).toHaveLength(1));
      wrapper.unmount();
    });

    it('accepts a Standard Schema as the field-level validate', async () => {
      const { wrapper, invalidErrors } = mountFieldForm({
        validate: z.string().min(5, 'Too short')
      });

      await wrapper.find('input[placeholder="username"]').setValue('ab');
      await wrapper.find('input[placeholder="age"]').setValue(18);
      await submitForm(wrapper);

      expect(invalidErrors.value?.['username']).toBe('Too short');
      wrapper.unmount();
    });

    it('rebinds a reactive field-level validate', async () => {
      const rule = ref<(value: unknown) => string | undefined>(() => undefined);
      const { wrapper, invalidErrors } = mountFieldForm({ validate: rule });

      await wrapper.find('input[placeholder="username"]').setValue('soybean');
      await wrapper.find('input[placeholder="age"]').setValue(18);
      await submitForm(wrapper);
      expect(invalidErrors.value).toBeNull();

      rule.value = () => 'Changed rule';
      await wrapper.find('input[placeholder="username"]').setValue('ab');
      await submitForm(wrapper);

      expect(invalidErrors.value?.['username']).toBe('Changed rule');
      wrapper.unmount();
    });

    it('resets field values on form reset', async () => {
      const { wrapper } = mountFieldForm({ defaultValues: { username: 'initial', age: 20 } });

      await wrapper.find('input[placeholder="username"]').setValue('changed');
      expect((wrapper.find('input[placeholder="username"]').element as HTMLInputElement).value).toBe('changed');

      await wrapper.find('form').trigger('reset');
      await nextTick();

      expect((wrapper.find('input[placeholder="username"]').element as HTMLInputElement).value).toBe('initial');
      wrapper.unmount();
    });

    it('marks the form as submitting during an async submit', async () => {
      const { wrapper, isSubmitting } = mountFieldForm({ onSubmitDelay: 30 });

      await wrapper.find('input[placeholder="username"]').setValue('soybean');
      await wrapper.find('input[placeholder="age"]').setValue(18);
      await wrapper.find('form').trigger('submit');
      await nextTick();

      expect(isSubmitting!.value).toBe(true);

      // 轮询而不是睡过 30ms 的提交延迟：固定睡眠是在和定时器赛跑，CI 拥塞时定时器
      // 晚触发的量级足以吃掉任何预留余量（40ms 等 30ms 曾在 CI 上稳定翻车）。
      await vi.waitFor(() => expect(isSubmitting!.value).toBe(false));
      wrapper.unmount();
    });
  });

  describe('field array', () => {
    it('renders array entries from initial values', () => {
      const wrapper = mountArrayForm({
        defaultValues: { emails: ['a@example.com', 'b@example.com'] }
      });

      expect(wrapper.findAll('[data-test="array-item"]')).toHaveLength(2);
      expect(wrapper.find('[data-test="array-label"]').text()).toBe('Emails (2)');
      wrapper.unmount();
    });

    it('appends a new array entry', async () => {
      const wrapper = mountArrayForm({ defaultValues: { emails: ['a@example.com'] } });

      await wrapper.get('[data-test="append-btn"]').trigger('click');
      await nextTick();

      expect(wrapper.findAll('[data-test="array-item"]')).toHaveLength(2);
      wrapper.unmount();
    });

    it('removes an array entry', async () => {
      const wrapper = mountArrayForm({
        defaultValues: { emails: ['a@example.com', 'b@example.com'] }
      });

      await wrapper
        .findAll('button[type="button"]')
        .find(b => b.text() === 'Remove')!
        .trigger('click');
      await nextTick();

      expect(wrapper.findAll('[data-test="array-item"]')).toHaveLength(1);
      wrapper.unmount();
    });

    it('keeps array entry keys stable across removal', async () => {
      const wrapper = mountArrayForm({
        defaultValues: { emails: ['a@example.com', 'b@example.com'] }
      });

      const keysBefore = wrapper.findAll('[data-test="array-item"]').map(item => item.attributes('data-key'));

      await wrapper
        .findAll('button[type="button"]')
        .find(b => b.text() === 'Remove')!
        .trigger('click');
      await nextTick();

      const keysAfter = wrapper.findAll('[data-test="array-item"]').map(item => item.attributes('data-key'));

      expect(keysAfter).toEqual(keysBefore.slice(1));
      wrapper.unmount();
    });

    it('validates array field values', async () => {
      const wrapper = mountArrayForm({ defaultValues: { emails: [] } });

      await submitForm(wrapper);

      expect(wrapper.find('[data-vean-form-error]').text()).toBe('At least one email is required');
      wrapper.unmount();
    });
  });

  describe('type inference', () => {
    it('infers Values from the schema', async () => {
      const submitted: any[] = [];
      const Form = defineComponent({
        setup() {
          const ctx = useForm({
            schema: probeSchema,
            defaultValues: { name: 'probe', count: 1 },
            onSubmit: async values => {
              const check: Equal<typeof values, { name: string; count: number }> = true;
              void check;
              submitted.push(values);
            }
          });
          return { handleSubmit: ctx.handleSubmit };
        },
        render() {
          return h('form', { onSubmit: this.handleSubmit });
        }
      });
      const wrapper = mount(Form, { attachTo: document.body });
      await submitForm(wrapper);

      expect(submitted).toEqual([{ name: 'probe', count: 1 }]);
      wrapper.unmount();
    });

    it('infers Values from defaultValues when no schema is given', async () => {
      const submitted: any[] = [];
      const Form = defineComponent({
        setup() {
          const ctx = useForm({
            defaultValues: { name: 'probe', count: 1 },
            onSubmit: async values => {
              const check: Equal<typeof values, { name: string; count: number }> = true;
              void check;
              submitted.push(values);
            }
          });
          return { handleSubmit: ctx.handleSubmit };
        },
        render() {
          return h('form', { onSubmit: this.handleSubmit });
        }
      });
      const wrapper = mount(Form, { attachTo: document.body });
      await submitForm(wrapper);

      expect(submitted).toEqual([{ name: 'probe', count: 1 }]);
      wrapper.unmount();
    });
  });

  describe('accessibility', () => {
    it('associates the label with the field input via for / id', () => {
      const { wrapper } = mountFieldForm();
      const labelFor = wrapper.find('[data-vean-form-label]').attributes('for');
      const inputId = wrapper.find('input[placeholder="username"]').attributes('id');

      expect(labelFor).toBe(inputId);
      expect(labelFor).toMatch(/^form-field-/);
      wrapper.unmount();
    });

    it('wires aria-describedby to the description element', async () => {
      const { wrapper } = mountFieldForm();
      const input = wrapper.find('input[placeholder="username"]');
      const describedBy = input.attributes('aria-describedby');

      expect(describedBy).toMatch(/^form-field-description-/);
      expect(wrapper.find(`#${describedBy}`).attributes('data-vean-form-description')).toBeDefined();
      wrapper.unmount();
    });

    it('sets aria-invalid on the field input when the field has an error', async () => {
      const { wrapper } = mountFieldForm();

      await clearInput(wrapper, 'input[placeholder="username"]');
      await submitForm(wrapper);

      expect(wrapper.find('input[placeholder="username"]').attributes('aria-invalid')).toBe('true');
      wrapper.unmount();
    });

    it('has no axe violations in the default state', async () => {
      const { wrapper } = mountFieldForm();
      const violations = await getA11yViolations(wrapper.element);

      expect(violations).toHaveLength(0);
      wrapper.unmount();
    });
  });
});
