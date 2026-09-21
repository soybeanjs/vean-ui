import { computed, inject, isRef, provide, watch } from 'vue';
import type { ComputedRef } from 'vue';
import { useField as useTanStackField, useForm as useTanStackForm } from '@tanstack/vue-form';
import type { DeepKeys, DeepValue, StandardSchemaV1 } from '@tanstack/vue-form';
import { klona } from '../../shared';
import type {
  FormErrors,
  FormFieldArrayStates,
  FormFieldMeta,
  FormFieldRegisterOptions,
  FormFieldState,
  FormFieldValidate,
  FormFieldValidateSource,
  FormValidateMode,
  FormValues,
  FormValuesSchema,
  InferStandardSchemaInput,
  UseFormOptions,
  UseFormReturn
} from './types';

const USE_FORM_CONTEXT_KEY = Symbol('UseFormContext');

const FORM_ERROR_CAUSES = ['onMount', 'onChange', 'onBlur', 'onSubmit'] as const;

type FormContext = UseFormReturn<FormValues>;

type SchemaValidator<Values extends FormValues> = StandardSchemaV1<Values, unknown>;

type FieldErrorResult = string | undefined | Promise<string | undefined>;

type FieldAsyncValidator<Value> = (props: { value: Value }) => FieldErrorResult;

type FieldValidateSlot<Value> = FieldAsyncValidator<Value> | StandardSchemaV1<Value, unknown>;

type FieldValidatorSlots<Value> = {
  onChangeAsync?: FieldValidateSlot<Value>;
  onBlurAsync?: FieldValidateSlot<Value>;
  onSubmitAsync?: FieldValidateSlot<Value>;
};

/**
 * TanStack's array ops are typed against resolved `DeepValue` paths; with the open
 * `FormValues` record the element type can't be resolved, so the ops go through this
 * structural shape.
 */
interface ArrayValueOps {
  pushFieldValue: (field: string, value: unknown) => void;
  insertFieldValue: (field: string, index: number, value: unknown) => Promise<void> | void;
  removeFieldValue: (field: string, index: number) => Promise<void> | void;
  swapFieldValues: (field: string, indexA: number, indexB: number) => void;
  moveFieldValues: (field: string, index1: number, index2: number) => void;
  replaceFieldValue: (field: string, index: number, value: unknown) => Promise<void> | void;
  setFieldValue: (field: string, value: unknown) => void;
}

function toValidatorKey(mode: FormValidateMode): 'onChange' | 'onBlur' | 'onSubmit' {
  if (mode === 'blur') return 'onBlur';
  if (mode === 'submit') return 'onSubmit';
  return 'onChange';
}

function toErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === 'string' ? message : '';
  }
  return '';
}

function firstErrorMessage(errors: readonly unknown[] | undefined): string | undefined {
  if (!errors) return undefined;
  for (const error of errors) {
    const message = toErrorMessage(error);
    if (message) return message;
  }
  return undefined;
}

function toFieldMeta(meta: { isDirty: boolean; isTouched: boolean; errors: readonly unknown[] }): FormFieldMeta {
  return {
    dirty: meta.isDirty,
    error: firstErrorMessage(meta.errors),
    touched: meta.isTouched
  };
}

function isStandardSchema<Value>(validate: FormFieldValidate<Value>): validate is StandardSchemaV1<Value, unknown> {
  return typeof validate === 'object' && '~standard' in validate;
}

/** Unwraps Ref / ComputedRef validate sources; plain functions and schemas pass through. */
function resolveValidateOption<Value>(
  validate: FormFieldValidateSource<Value> | undefined
): FormFieldValidate<Value> | undefined {
  let source = validate;
  while (isRef(source)) {
    source = source.value;
  }
  return source;
}

function buildFieldValidators<Value>(
  mode: FormValidateMode,
  validate?: FormFieldValidate<Value>
): FieldValidatorSlots<Value> {
  // Standard Schema validators are handed to the engine untouched (its async slots run
  // them natively); functions are wrapped. The async slots accept both returns, so each
  // validation cause runs the validator exactly once. Submit-cause slots are always
  // attached so `handleSubmit` awaits field validation.
  if (!validate) return {};
  const adapter: FieldValidateSlot<Value> = isStandardSchema(validate) ? validate : props => validate(props.value);
  const key = toValidatorKey(mode);
  if (key === 'onSubmit') return { onSubmitAsync: adapter };
  if (key === 'onBlur') return { onBlurAsync: adapter, onSubmitAsync: adapter };
  return { onChangeAsync: adapter, onSubmitAsync: adapter };
}

/** Root-level schema issues carry no field path; the engine groups them under `''`. */
function rootIssuesOf(formError: unknown): readonly unknown[] | undefined {
  if (!formError || typeof formError !== 'object') return undefined;
  return (formError as Record<string, readonly unknown[] | undefined>)[''];
}

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
  const { validateMode = 'submit', validateOnMounted = false } = options;

  const defaultValues = klona(options.defaultValues ?? {}) as Values;

  // The overload keeps the schema typed by its own `S`; the engine needs it as a
  // validator for `Values`, and Standard Schema's covariant `types.input` makes this
  // the single variance bridge.
  const schemaValidator = options.schema as SchemaValidator<Values> | undefined;

  const buildSchemaValidators = () => {
    const key = toValidatorKey(validateMode);
    const validators: {
      onMount?: SchemaValidator<Values>;
      onChangeAsync?: SchemaValidator<Values>;
      onBlurAsync?: SchemaValidator<Values>;
      onSubmitAsync?: SchemaValidator<Values>;
    } = { onSubmitAsync: schemaValidator };
    if (key === 'onBlur') validators.onBlurAsync = schemaValidator;
    if (key === 'onChange') validators.onChangeAsync = schemaValidator;
    if (validateOnMounted) validators.onMount = schemaValidator;
    return validators;
  };

  const form = useTanStackForm<
    Values,
    SchemaValidator<Values> | undefined,
    undefined,
    SchemaValidator<Values> | undefined,
    undefined,
    SchemaValidator<Values> | undefined,
    undefined,
    SchemaValidator<Values> | undefined,
    undefined,
    undefined,
    undefined,
    never
  >({
    // The passthrough spreads first so wrapper-owned fields always win.
    ...options.formOptions,
    defaultValues,
    validators: buildSchemaValidators(),
    onSubmit: ({ value }) => options.onSubmit?.(value),
    onSubmitInvalid: () => options.onInvalid?.(collectErrors())
  });

  function collectErrors(): FormErrors {
    const errors: FormErrors = {};
    const fieldMeta = form.state.fieldMeta as Record<string, { errors?: readonly unknown[] } | undefined>;
    Object.keys(fieldMeta).forEach(name => {
      const message = firstErrorMessage(fieldMeta[name]?.errors);
      if (message) {
        errors[name] = message;
      }
    });
    const errorMap = form.state.errorMap as Record<string, unknown>;
    FORM_ERROR_CAUSES.forEach(cause => {
      const formError = errorMap[cause];
      const message = typeof formError === 'string' ? formError : firstErrorMessage(rootIssuesOf(formError));
      if (message) {
        errors._form ??= message;
      }
    });
    return errors;
  }

  function useField<Name extends DeepKeys<Values>>(
    name: Name,
    opts?: FormFieldRegisterOptions<DeepValue<Values, Name>>
  ): ComputedRef<FormFieldState<Values, Name>> {
    const resolveValidate = () => resolveValidateOption(opts?.validate);
    const field = useTanStackField({
      form,
      name,
      validators: buildFieldValidators(validateMode, resolveValidate())
    });

    // Ref / ComputedRef validate sources rebind the field validators on change; plain
    // functions resolve to the same reference and never trigger.
    watch(resolveValidate, value => {
      field.api.update({ form, name, validators: buildFieldValidators(validateMode, value) });
    });

    return computed<FormFieldState<Values, Name>>(() => ({
      name,
      value: field.state.value,
      meta: toFieldMeta(field.state.meta),
      handleChange: value => field.api.handleChange(value),
      onBlur: () => field.api.handleBlur()
    }));
  }

  function useFieldArray<Name extends DeepKeys<Values>>(
    name: Name,
    opts?: FormFieldRegisterOptions<DeepValue<Values, Name>>
  ): ComputedRef<FormFieldArrayStates<Values, Name>> {
    const resolveValidate = () => resolveValidateOption(opts?.validate);
    const field = useTanStackField({
      form,
      name,
      mode: 'array',
      validators: buildFieldValidators(validateMode, resolveValidate())
    });

    watch(resolveValidate, value => {
      field.api.update({ form, name, validators: buildFieldValidators(validateMode, value) });
    });

    const arrayOps = form as unknown as ArrayValueOps;

    // Entry keys must survive remove / insert / move, so every op adjusts a parallel key
    // list positionally; length drift from external mutations (setFieldValue / reset)
    // is re-synced on read.
    let keySeed = 0;
    let entryKeys: string[] = [];
    const nextKey = () => `${String(name)}-${keySeed++}`;

    return computed<FormFieldArrayStates<Values, Name>>(() => {
      const value: unknown = field.state.value;
      const items = Array.isArray(value) ? [...value] : [];
      entryKeys = entryKeys.slice(0, items.length);
      while (entryKeys.length < items.length) {
        entryKeys.push(nextKey());
      }

      return {
        name,
        fields: items.map((item, index) => ({ key: entryKeys[index]!, name, value: item })),
        meta: toFieldMeta(field.state.meta),
        append: item => {
          entryKeys.push(nextKey());
          arrayOps.pushFieldValue(name, item);
        },
        prepend: item => {
          entryKeys.unshift(nextKey());
          arrayOps.insertFieldValue(name, 0, item);
        },
        insert: (index, item) => {
          entryKeys.splice(index, 0, nextKey());
          arrayOps.insertFieldValue(name, index, item);
        },
        remove: index => {
          const target = index ?? Math.max(items.length - 1, 0);
          entryKeys.splice(target, 1);
          arrayOps.removeFieldValue(name, target);
        },
        swap: (indexA, indexB) => {
          [entryKeys[indexA], entryKeys[indexB]] = [entryKeys[indexB]!, entryKeys[indexA]!];
          arrayOps.swapFieldValues(name, indexA, indexB);
        },
        move: (from, to) => {
          const [key] = entryKeys.splice(from, 1);
          entryKeys.splice(to, 0, key!);
          arrayOps.moveFieldValues(name, from, to);
        },
        update: (index, item) => arrayOps.replaceFieldValue(name, index, item),
        replace: nextItems => {
          entryKeys = nextItems.map(() => nextKey());
          arrayOps.setFieldValue(name, nextItems);
        }
      };
    });
  }

  function handleSubmit(event?: Event) {
    event?.preventDefault();
    return form.handleSubmit();
  }

  function handleReset(event?: Event) {
    event?.preventDefault();
    form.reset();
  }

  const context: UseFormReturn<Values> = {
    form,
    isSubmitting: form.useSelector(state => state.isSubmitting),
    handleSubmit,
    handleReset,
    useField,
    useFieldArray
  };

  provide(USE_FORM_CONTEXT_KEY, context);

  return context;
}

export function useFormSub(): FormContext {
  const context = inject<FormContext | undefined>(USE_FORM_CONTEXT_KEY);
  if (!context) {
    throw new Error('useFormSub must be used within a useForm provider');
  }
  return context;
}
