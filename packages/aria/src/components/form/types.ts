import type {
  ComponentOptionsMixin,
  ComputedRef,
  CreateComponentPublicInstanceWithMixins,
  EmitsOptions,
  FormHTMLAttributes,
  PublicProps,
  Ref,
  SlotsType
} from 'vue';
import type {
  DeepKeys,
  DeepKeysOfType,
  DeepValue,
  FormApi,
  FormOptions,
  StandardSchemaV1,
  VueFormApi
} from '@tanstack/vue-form';
import type { BaseProps, DataOrientation, MaybePromise, ToContext, UiClass } from '../../types';
import type { LabelProps } from '../label/types';

export type { StandardSchemaV1 } from '@tanstack/vue-form';

/**
 * Form values shape, compatible with Standard Schema validators (Zod / Valibot / ...).
 */
export type FormValues = Record<string, any>;

/**
 * Standard Schema validator accepted by the form engine.
 */
export type FormValuesSchema = StandardSchemaV1<FormValues, FormValues>;

/**
 * When validation runs relative to user interaction.
 */
export type FormValidateMode = 'blur' | 'change' | 'submit';

/**
 * Field-level validator function. Return a string to flag the field as invalid.
 */
export type FormFieldValidator<Value> = (value: Value) => MaybePromise<string | undefined>;

/**
 * Flattened form errors keyed by field path. Root-level schema issues (no field path)
 * are exposed under the `_form` key.
 */
export type FormErrors = Record<string, string>;

/**
 * Type information for InferStandardSchemaInput.
 */
export type InferStandardSchemaInput<S extends StandardSchemaV1<FormValues, FormValues>> = NonNullable<
  S['~standard']['types']
>['input'];

/**
 * Display state of a single field, derived from the TanStack field meta.
 */
export interface FormFieldMeta {
  /**
   * Whether the field value differs from its default value.
   */
  dirty: boolean;
  /**
   * First error message of the field, if any.
   */
  error: string | undefined;
  /**
   * Whether the field has been blurred.
   */
  touched: boolean;
}

/**
 * Options for the TanStack-backed `useForm`. `Values` is inferred from `schema` when
 * provided, otherwise from `defaultValues`.
 */
export interface UseFormOptions<Values extends FormValues = FormValues> {
  /**
   * Standard Schema compatible validator (Zod / Valibot / ...). When omitted the form
   * runs on field-level validators only and `Values` falls back to the open
   * `FormValues` record unless inferred from `defaultValues` or provided explicitly.
   */
  schema?: StandardSchemaV1<Values, unknown>;
  /**
   * Default values of the form; also the baseline restored by `handleReset`
   * (TanStack `defaultValues` internally).
   */
  defaultValues?: NoInfer<Values>;
  /**
   * Validation timing of the schema and field-level validators.
   *
   * @default 'submit'
   */
  validateMode?: FormValidateMode;
  /**
   * Whether to validate when the form mounts.
   */
  validateOnMounted?: boolean;
  /**
   * Callback invoked with the form values when submission succeeds.
   */
  onSubmit?: (values: NoInfer<Values>) => any | Promise<any>;
  /**
   * Callback invoked with flattened errors when submission fails.
   */
  onInvalid?: (errors: FormErrors) => void;
  /**
   * TanStack `FormOptions` passthrough for advanced tuning (`asyncDebounceMs`,
   * `canSubmitWhenInvalid`, `listeners`, `formId`, ...). Applied before the
   * wrapper-owned fields, which always win; validation stays driven by `schema`,
   * `validateMode` and field-level `validate`.
   */
  formOptions?: FormOptionsOf<Values>;
}

/**
 * Field-level validator: a sync or async function, or a Standard Schema validator
 * (Zod / Valibot / ...) run by the engine against the field value.
 */
export type FormFieldValidate<Value> = FormFieldValidator<Value> | StandardSchemaV1<Value, unknown>;

/**
 * Accepted shapes of a field-level validator: the validator itself, or a Ref /
 * ComputedRef of it (resolving to `undefined` when unset) for reactive rebinding.
 */
export type FormFieldValidateSource<Value> =
  | FormFieldValidate<Value>
  | Ref<FormFieldValidate<Value> | undefined>
  | ComputedRef<FormFieldValidate<Value> | undefined>;

/**
 * Registration options of a single field.
 */
export interface FormFieldRegisterOptions<Value> {
  /**
   * Field-level validator. May be a sync or async function, a Standard Schema
   * validator, or a Ref / ComputedRef of either for reactive rebinding.
   */
  validate?: FormFieldValidateSource<Value>;
}

/**
 * Reactive state exposed to a field slot.
 */
export interface FormFieldState<Values extends FormValues, Name extends DeepKeys<Values>> {
  /**
   * Field name.
   */
  name: Name;
  /**
   * Current field value.
   */
  value: DeepValue<Values, Name>;
  /**
   * Field meta.
   */
  meta: FormFieldMeta;
  /**
   * Change handler, wires the value and change-cause validation.
   */
  handleChange: (value: DeepValue<Values, Name>) => void;
  /**
   * Blur handler, wires touched state and blur validation.
   */
  onBlur: () => void;
}

/**
 * A single entry of a field array.
 */
export interface FormFieldArrayState<Values extends FormValues, Name extends DeepKeys<Values>> {
  /**
   * Stable key for list rendering.
   */
  key: string;
  /**
   * Name of the array field.
   */
  name: Name;
  /**
   * Value of the entry.
   */
  value: unknown;
}

/**
 * State and operations exposed to a field array slot.
 */
export interface FormFieldArrayStates<Values extends FormValues, Name extends DeepKeys<Values>> {
  /**
   * Name of the array field.
   */
  name: Name;
  /**
   * Entries of the array.
   */
  fields: readonly FormFieldArrayState<Values, Name>[];
  /**
   * Meta of the array field itself.
   */
  meta: FormFieldMeta;
  /**
   * Append an entry to the end.
   */
  append: (value: FormFieldArrayState<Values, Name>['value']) => void;
  /**
   * Prepend an entry to the beginning.
   */
  prepend: (value: FormFieldArrayState<Values, Name>['value']) => void;
  /**
   * Remove the entry at the given index (defaults to the last one).
   */
  remove: (index?: number) => void;
  /**
   * Swap two entries.
   */
  swap: (indexA: number, indexB: number) => void;
  /**
   * Move an entry to another position.
   */
  move: (from: number, to: number) => void;
  /**
   * Insert an entry at the given index.
   */
  insert: (index: number, value: FormFieldArrayState<Values, Name>['value']) => void;
  /**
   * Replace the entry at the given index.
   */
  update: (index: number, value: FormFieldArrayState<Values, Name>['value']) => void;
  /**
   * Replace the whole array.
   */
  replace: (values: FormFieldArrayState<Values, Name>['value'][]) => void;
}

/**
 * Return of the Aria `useForm`, TanStack FormApi first.
 */
export interface UseFormReturn<Values extends FormValues = FormValues> {
  /**
   * TanStack FormApi (Vue flavored, with `Field` / `Subscribe` / `useSelector`).
   * For reactive state reads use `form.useSelector(state => ...)`; `form.state`
   * itself is a TanStack Store snapshot without Vue reactivity.
   */
  form: FormApiOf<Values>;
  /**
   * Whether the form is currently submitting.
   */
  isSubmitting: Readonly<Ref<boolean>>;
  /**
   * Submit handler bound to the form element.
   */
  handleSubmit: (event?: Event) => Promise<void>;
  /**
   * Reset handler bound to the form element; restores `defaultValues`.
   */
  handleReset: (event?: Event) => void;
  /**
   * Register a field and subscribe to its state.
   */
  useField: <Name extends DeepKeys<Values>>(
    name: Name,
    opts?: FormFieldRegisterOptions<DeepValue<Values, Name>>
  ) => ComputedRef<FormFieldState<Values, Name>>;
  /**
   * Register an array field and subscribe to its entries.
   */
  useFieldArray: <Name extends DeepKeys<Values> & DeepKeysOfType<Values, readonly any[]>>(
    name: Name,
    opts?: FormFieldRegisterOptions<DeepValue<Values, Name>>
  ) => ComputedRef<FormFieldArrayStates<Values, Name>>;
}

/**
 * TanStack `FormOptions` passthrough accepted by Vean forms: instantiated with the
 * same validator slots as `FormApiOf`, minus the fields the wrapper owns
 * (`defaultValues` / `validators` / `onSubmit` / `onSubmitInvalid`).
 */
export type FormOptionsOf<Values extends FormValues = FormValues> = Omit<
  FormOptions<
    Values,
    StandardSchemaV1<Values, unknown> | undefined,
    undefined,
    StandardSchemaV1<Values, unknown> | undefined,
    undefined,
    StandardSchemaV1<Values, unknown> | undefined,
    undefined,
    StandardSchemaV1<Values, unknown> | undefined,
    undefined,
    undefined,
    undefined,
    never
  >,
  'defaultValues' | 'validators' | 'onSubmit' | 'onSubmitInvalid'
>;

/**
 * TanStack FormApi instantiation used by Vean forms: the schema is registered on
 * the async validator slots (which also accept sync returns) and, with
 * `validateOnMounted`, on the sync `onMount` slot.
 */
export type FormApiOf<Values extends FormValues = FormValues> = FormApi<
  Values,
  StandardSchemaV1<Values, unknown> | undefined,
  undefined,
  StandardSchemaV1<Values, unknown> | undefined,
  undefined,
  StandardSchemaV1<Values, unknown> | undefined,
  undefined,
  StandardSchemaV1<Values, unknown> | undefined,
  undefined,
  undefined,
  undefined,
  never
> &
  VueFormApi<
    Values,
    StandardSchemaV1<Values, unknown> | undefined,
    undefined,
    StandardSchemaV1<Values, unknown> | undefined,
    undefined,
    StandardSchemaV1<Values, unknown> | undefined,
    undefined,
    StandardSchemaV1<Values, unknown> | undefined,
    undefined,
    undefined,
    undefined,
    never
  >;

/**
 * Properties for the FormField component.
 */
export interface FormFieldProps extends BaseProps {
  /**
   * Error.
   */
  error?: string;
  /**
   * Whether the field is an array.
   */
  isFieldArray?: boolean;
}

/**
 * Properties for the FormLabel component.
 */
export interface FormLabelProps extends LabelProps {}

/**
 * Properties for the FormControl component.
 */
export interface FormControlProps extends BaseProps {}

/**
 * Properties for the FormDescription component.
 */
export interface FormDescriptionProps extends BaseProps {}

/**
 * Properties for the FormError component.
 */
export interface FormErrorProps extends BaseProps {}

/**
 * Context for the FormField component.
 */
export interface FormFieldContext {
  /**
   * Error used by the component context.
   */
  error: ComputedRef<string | undefined>;
}

/**
 * Common properties for form field and form field array components, used in both compact and non-compact modes.
 */
export interface FormFieldCommonProps {
  /**
   * Orientation of the form field.
   *
   * @default 'vertical'
   */
  orientation?: DataOrientation;
  /**
   * Label text rendered by the component.
   */
  label?: string;
  /**
   * Description text rendered by the component.
   */
  description?: string;
  /**
   * Properties forwarded to the label element.
   */
  labelProps?: FormLabelProps;
  /**
   * Properties forwarded to the control element.
   */
  controlProps?: FormControlProps;
  /**
   * Properties forwarded to the description element.
   */
  descriptionProps?: FormDescriptionProps;
  /**
   * Properties forwarded to the error element.
   */
  errorProps?: FormErrorProps;
}

/**
 * Properties for the FormFieldBaseCompact component.
 */
export interface FormFieldBaseCompactProps extends FormFieldProps, FormFieldCommonProps {}

/**
 * Slots for the FormFieldBaseCompact component.
 */
export type FormFieldBaseCompactSlots = {
  /**
   * Custom content for the default slot.
   */
  default?: () => any;
  /**
   * Custom content for the label slot.
   */
  label?: () => any;
  /**
   * Custom content for the description slot.
   */
  description?: () => any;
  /**
   * Custom content for the error slot; falls back to a plain FormError.
   */
  error?: (props: { error: string | undefined; errorProps: FormErrorProps }) => any;
};

/**
 * Properties for the FormFieldCompact component.
 */
export interface FormFieldCompactProps<Values extends FormValues, Name extends DeepKeys<Values>>
  extends Omit<FormFieldProps, 'error'>, FormFieldCommonProps, FormFieldRegisterOptions<DeepValue<Values, Name>> {
  /**
   * The name of the form field, used for registration and value retrieval.
   */
  name: Name;
}

/**
 * Slots for the FormFieldCompact component.
 */
export type FormFieldCompactSlots<Values extends FormValues, Name extends DeepKeys<Values>> = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: FormFieldState<Values, Name>) => any;
  /**
   * Custom content for the label slot.
   */
  label?: (props: FormFieldState<Values, Name>) => any;
  /**
   * Custom content for the description slot.
   */
  description?: (props: FormFieldState<Values, Name>) => any;
  /**
   * Custom content for the error slot.
   */
  error?: (props: { error: string | undefined; errorProps: FormErrorProps }) => any;
};

/**
 * Slots for the FormFieldArrayCompact component.
 */
export type FormFieldArrayCompactSlots<Values extends FormValues, Name extends DeepKeys<Values>> = {
  /**
   * Custom content for the default slot.
   */
  default?: (props: FormFieldArrayStates<Values, Name>) => any;
  /**
   * Custom content for the label slot.
   */
  label?: (props: FormFieldArrayStates<Values, Name>) => any;
  /**
   * Custom content for the description slot.
   */
  description?: (props: FormFieldArrayStates<Values, Name>) => any;
  /**
   * Custom content for the error slot.
   */
  error?: (props: { error: string | undefined; errorProps: FormErrorProps }) => any;
};

/**
 * Typed constructor of the FormFieldCompact component, bound to the schema-inferred values.
 */
export type FormFieldComponent<Values extends FormValues, ExtraProps extends Record<string, any> = {}> = new <
  Name extends DeepKeys<Values>
>(
  props: FormFieldCompactProps<Values, Name> & PublicProps & ExtraProps
) => CreateComponentPublicInstanceWithMixins<
  FormFieldCompactProps<Values, Name> & ExtraProps,
  {},
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  EmitsOptions,
  PublicProps,
  {},
  false,
  {},
  SlotsType<FormFieldCompactSlots<Values, Name>>
>;

/**
 * Typed constructor of the FormFieldArrayCompact component, bound to the schema-inferred values.
 */
export type FormFieldArrayComponent<Values extends FormValues, ExtraProps extends Record<string, any> = {}> = new <
  Name extends DeepKeys<Values>
>(
  props: FormFieldCompactProps<Values, Name> & PublicProps & ExtraProps
) => CreateComponentPublicInstanceWithMixins<
  FormFieldCompactProps<Values, Name> & ExtraProps,
  {},
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  EmitsOptions,
  PublicProps,
  {},
  false,
  {},
  SlotsType<FormFieldArrayCompactSlots<Values, Name>>
>;

/**
 * Properties for the FormCompact component.
 */
export interface FormCompactProps
  extends
    Pick<FormFieldCommonProps, 'orientation' | 'labelProps' | 'controlProps' | 'descriptionProps' | 'errorProps'>,
    BaseProps<FormHTMLAttributes> {
  fieldProps?: FormFieldProps;
  fieldArrayProps?: FormFieldProps;
}

/**
 * Context for the FormCompact component.
 */
export interface FormCompactContext extends ToContext<
  FormCompactProps,
  'orientation' | 'fieldProps' | 'fieldArrayProps' | 'labelProps' | 'controlProps' | 'descriptionProps' | 'errorProps'
> {}

/**
 * Available UI slots for the FormField component.
 */
export type FormFieldUiSlot = 'field' | 'fieldArray' | 'label' | 'control' | 'description' | 'error';

/**
 * UI class overrides for the FormField component.
 */
export type FormFieldUi = UiClass<FormFieldUiSlot>;

export type FormUiSlot = 'form' | FormFieldUiSlot;

export type FormUi = UiClass<FormUiSlot>;
