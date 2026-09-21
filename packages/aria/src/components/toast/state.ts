import { isVNode } from 'vue';
import type { VNode } from 'vue';
import type {
  ToastT,
  ToastExternal,
  ToastPromise,
  ToastPromiseData,
  ToastPromiseResolver,
  ToastPromiseResult,
  ToastOrDismiss,
  ToastSubscriber,
  ToastCreateOptions
} from './types';

let toastsCounter = 1;

type ToastId = ToastT['id'];

class ToastObserver {
  subscribers: ToastSubscriber[];
  toasts: ToastOrDismiss[];
  dismissed: Set<ToastId>;

  constructor() {
    this.subscribers = [];
    this.toasts = [];
    this.dismissed = new Set();
  }

  subscribe = (subscriber: ToastSubscriber) => {
    this.subscribers.push(subscriber);

    return () => {
      const index = this.subscribers.indexOf(subscriber);

      if (index >= 0) {
        this.subscribers.splice(index, 1);
      }
    };
  };

  publish = (data: ToastOrDismiss) => {
    this.subscribers.forEach(subscriber => subscriber(data));
  };

  resetDismissed = (id: ToastId) => {
    if (this.dismissed.has(id)) {
      this.dismissed.delete(id);
    }
  };

  upsert = (toast: ToastT) => {
    const index = this.toasts.findIndex(item => item.id === toast.id);

    if (index < 0) {
      this.publish(toast);
      this.toasts = [...this.toasts, toast];
      return;
    }

    const next = { ...this.toasts[index], ...toast };

    this.publish(next);
    this.toasts = this.toasts.map((item, itemIndex) => (itemIndex === index ? next : item));
  };

  create = (options: ToastCreateOptions) => {
    const { message, dismissible = true, ...rest } = options;

    const id = resolveToastId(options.id);

    this.resetDismissed(id);

    const updated: ToastT = {
      ...rest,
      id,
      dismissible,
      title: message
    };

    this.upsert(updated);

    return id;
  };

  dismiss = (id?: ToastId) => {
    if (id !== undefined) {
      this.dismissed.add(id);

      requestAnimationFrame(() => this.publish({ id, dismiss: true }));

      return id;
    }

    this.toasts.forEach(item => {
      this.dismissed.add(item.id);
      this.publish({ id: item.id, dismiss: true });
    });
  };

  message = (message: VNode | string, data?: ToastExternal) => {
    return this.create({ ...data, message, type: 'default' });
  };

  error = (message: VNode | string, data?: ToastExternal) => {
    return this.create({ ...data, message, type: 'error' });
  };

  success = (message: VNode | string, data?: ToastExternal) => {
    return this.create({ ...data, message, type: 'success' });
  };

  info = (message: VNode | string, data?: ToastExternal) => {
    return this.create({ ...data, message, type: 'info' });
  };

  warning = (message: VNode | string, data?: ToastExternal) => {
    return this.create({ ...data, message, type: 'warning' });
  };

  loading = (message: VNode | string, data?: ToastExternal) => {
    return this.create({ ...data, message, type: 'loading' });
  };

  custom = (component: VNode, data?: ToastExternal) => {
    const id = resolveToastId(data?.id);
    const dismissible = data?.dismissible ?? true;

    this.resetDismissed(id);

    this.upsert({ custom: component, dismissible, id, ...data });

    return id;
  };

  promise = <T>(promise: ToastPromise<T>, data?: ToastPromiseData<T>) => {
    if (!data) {
      return;
    }

    let id: ToastId | undefined;

    if (data.loading !== undefined) {
      id = this.create({
        ...data,
        promise,
        type: 'loading',
        message: data.loading,
        description: typeof data.description !== 'function' ? data.description : undefined
      });
    }

    const resolvedPromise = Promise.resolve(typeof promise === 'function' ? promise() : promise);

    let shouldDismiss = id !== undefined;
    let result: ['resolve', T] | ['reject', unknown];

    const createToastPromise = async (
      type: 'error' | 'success',
      content: ToastPromiseData<T>['success'] | ToastPromiseData<T>['error'],
      description: ToastPromiseData<T>['description'],
      value: unknown
    ) => {
      shouldDismiss = false;

      const { description: resolvedDescription, settings } = await resolveToastPromise(content, description, value, id);

      this.create({ id, type, description: resolvedDescription, ...settings });
    };

    const originalPromise = resolvedPromise
      .then(async response => {
        result = ['resolve', response];

        if (isVNode(response)) {
          shouldDismiss = false;
          this.create({ id, type: 'default', message: response });
          return;
        }

        if (isHttpResponse(response) && !response.ok) {
          await createToastPromise('error', data.error, data.description, `HTTP error! status: ${response.status}`);
          return;
        }

        if (response instanceof Error) {
          await createToastPromise('error', data.error, data.description, response);
          return;
        }

        if (data.success !== undefined) {
          await createToastPromise('success', data.success, data.description, response);
        }
      })
      .catch(async error => {
        result = ['reject', error];

        if (data.error !== undefined) {
          await createToastPromise('error', data.error, data.description, error);
        }
      })
      .finally(() => {
        if (shouldDismiss) {
          this.dismiss(id);
          id = undefined;
        }

        data.finally?.();
      });

    const unwrap = () =>
      new Promise<T>((resolve, reject) =>
        originalPromise.then(() => (result[0] === 'reject' ? reject(result[1]) : resolve(result[1]))).catch(reject)
      );

    if (typeof id !== 'string' && typeof id !== 'number') {
      return { unwrap };
    }

    return Object.assign(id, { unwrap });
  };

  getActives = () => {
    return this.toasts.filter(toast => !this.dismissed.has(toast.id)) as ToastT[];
  };
}

export const ToastState = new ToastObserver();

const createToast = ToastState.message;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActives();

export const toast = Object.assign(
  createToast,
  {
    success: ToastState.success,
    info: ToastState.info,
    warning: ToastState.warning,
    error: ToastState.error,
    custom: ToastState.custom,
    message: ToastState.message,
    promise: ToastState.promise,
    dismiss: ToastState.dismiss,
    loading: ToastState.loading
  },
  { getHistory, getToasts }
);

function isHttpResponse(data: unknown): data is Response {
  return (
    typeof data === 'object' &&
    data !== null &&
    'ok' in data &&
    typeof data.ok === 'boolean' &&
    'status' in data &&
    typeof data.status === 'number'
  );
}

function resolveToastId(id?: number | string) {
  return typeof id === 'number' || (typeof id === 'string' && id.length > 0) ? id : toastsCounter++;
}

async function resolveToastPromise(
  content: ToastPromiseResolver<ToastPromiseResult | VNode | string> | undefined,
  description: ToastPromiseResolver<VNode | string> | undefined,
  value: unknown,
  id: ToastId | undefined
) {
  const [resolvedContent, resolvedDescription] = await Promise.all([
    resolveToastPromiseValue(content, value),
    resolveToastPromiseValue(description, value)
  ]);

  return {
    description: resolvedDescription,
    settings: createToastPromiseResult(resolvedContent, id)
  };
}

async function resolveToastPromiseValue<TResult extends ToastPromiseResult | VNode | string>(
  value: ToastPromiseResolver<TResult> | undefined,
  data: unknown
): Promise<TResult | undefined> {
  if (typeof value === 'function') {
    return await value(data);
  }

  return value;
}

function isToastPromiseResult(data: unknown): data is ToastPromiseResult {
  return typeof data === 'object' && data !== null && 'message' in data;
}

function createToastPromiseResult(content: VNode | string | ToastPromiseResult | undefined, id: ToastId | undefined) {
  if (isToastPromiseResult(content)) {
    return content;
  }

  return { id: id ?? '', message: content ?? '' };
}
