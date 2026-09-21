import { useForm as _useForm } from '@vean/aria/form';
import type {
  FormFieldArrayComponent,
  FormFieldComponent,
  FormValues,
  FormValuesSchema,
  InferStandardSchemaInput
} from '@vean/aria/form';
import SFormFieldArray from './form-field-array.vue';
import SFormField from './form-field.vue';
import type { FormFieldExtraProps, UseFormOptions, UseFormReturn } from './types';

/**
 * Internal factory view of the Aria `useForm`: the public surface is overloaded for
 * type inference, while this wrapper re-exports the same overloads and needs a call
 * target whose option shape keeps the unresolved `Values` type parameter.
 */
type FormFactory = <Values extends FormValues>(
  options: Omit<UseFormOptions<Values>, 'schema'> & { schema?: FormValuesSchema }
) => UseFormReturn<Values>;

const createForm = _useForm as FormFactory;

export function useForm<S extends FormValuesSchema, Values extends FormValues = InferStandardSchemaInput<S>>(
  options: Omit<UseFormOptions<Values>, 'schema'> & { schema: S }
): UseFormReturn<Values>;
export function useForm<Values extends FormValues = FormValues>(
  options: Omit<UseFormOptions<Values>, 'defaultValues'> & {
    schema?: undefined;
    defaultValues?: Values;
  }
): UseFormReturn<Values>;
export function useForm<Values extends FormValues = FormValues>(
  options: Omit<UseFormOptions<Values>, 'schema'> & { schema?: FormValuesSchema }
): UseFormReturn<Values> {
  return withComponents(createForm(options));
}

// SFC 组件类型与 FormFieldComponent 构造器签名（泛型构造参数）存在结构性差异，经双重断言收窄为组件类型
function withComponents<Values extends FormValues>(context: UseFormReturn<Values>): UseFormReturn<Values> {
  return {
    ...context,
    SFormField: SFormField as unknown as FormFieldComponent<Values, FormFieldExtraProps>,
    SFormFieldArray: SFormFieldArray as unknown as FormFieldArrayComponent<Values, FormFieldExtraProps>
  };
}
