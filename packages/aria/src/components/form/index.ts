export { default as FormCompact } from './form-compact.vue';
export { default as FormFieldCompact } from './form-field-compact.vue';
export { default as FormFieldArrayCompact } from './form-field-array-compact.vue';
export { default as FormFieldBaseCompact } from './form-field-base-compact.vue';
export { default as FormField } from './form-field.vue';
export { default as FormLabel } from './form-label.vue';
export { default as FormControl } from './form-control.vue';
export { default as FormDescription } from './form-description.vue';
export { default as FormError } from './form-error.vue';

export { provideFormUi, provideFormFieldUi } from './context';
export { useForm, useFormSub } from './use-form';

export type { StandardSchemaV1 } from '@tanstack/vue-form';
export type {
  FormCompactProps,
  FormFieldCompactProps,
  FormFieldCompactSlots,
  FormFieldArrayCompactSlots,
  FormFieldBaseCompactProps,
  FormFieldBaseCompactSlots,
  FormFieldProps,
  FormLabelProps,
  FormControlProps,
  FormDescriptionProps,
  FormErrorProps,
  FormFieldUiSlot,
  FormFieldUi,
  FormUiSlot,
  FormUi,
  FormFieldContext,
  FormCompactContext,
  FormValues,
  FormValuesSchema,
  FormValidateMode,
  FormFieldValidator,
  FormFieldValidate,
  FormFieldValidateSource,
  FormErrors,
  FormFieldMeta,
  FormFieldRegisterOptions,
  FormFieldState,
  FormFieldArrayState,
  FormFieldArrayStates,
  UseFormOptions,
  UseFormReturn,
  FormApiOf,
  FormOptionsOf,
  FormFieldComponent,
  FormFieldArrayComponent,
  InferStandardSchemaInput
} from './types';
