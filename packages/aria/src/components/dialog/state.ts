import type { VNode } from 'vue';
import type { DialogT, DialogExternal, DialogSubscriber, DialogCreateOptions } from './types';

let dialogsCounter = 1;

type DialogId = DialogT['id'];

class DialogObserver {
  subscribers: DialogSubscriber[];
  dialogs: DialogT[];
  dismissed: Set<DialogId>;

  constructor() {
    this.subscribers = [];
    this.dialogs = [];
    this.dismissed = new Set();
  }

  subscribe = (subscriber: DialogSubscriber) => {
    this.subscribers.push(subscriber);

    return () => {
      const index = this.subscribers.indexOf(subscriber);

      if (index >= 0) {
        this.subscribers.splice(index, 1);
      }
    };
  };

  publish = (data: DialogT) => {
    this.subscribers.forEach(subscriber => subscriber(data));
  };

  resetDismissed = (id: DialogId) => {
    if (this.dismissed.has(id)) {
      this.dismissed.delete(id);
    }
  };

  upsert = (dialog: DialogT) => {
    const index = this.dialogs.findIndex(item => item.id === dialog.id);

    if (index < 0) {
      this.publish(dialog);
      this.dialogs = [...this.dialogs, dialog];
      return;
    }

    const next = { ...this.dialogs[index], ...dialog };

    this.publish(next);
    this.dialogs = this.dialogs.map((item, idx) => (idx === index ? next : item));
  };

  create = (options: DialogCreateOptions) => {
    const { open = true, ...rest } = options;

    const id = resolveDialogId(options.id);

    const dialog: DialogT = {
      ...rest,
      id,
      open
    };

    this.upsert(dialog);

    return id;
  };

  dismiss = (id?: DialogId) => {
    if (id !== undefined) {
      this.dismissed.add(id);

      requestAnimationFrame(() => this.publish({ id, open: false }));

      return id;
    }

    this.dialogs.forEach(dialog => {
      this.dismissed.add(dialog.id);
      this.publish({ id: dialog.id, open: false });
    });
  };

  message = (message: VNode | string, data?: DialogExternal) => {
    return this.create({ ...data, title: message, type: 'default' });
  };

  error = (message: VNode | string, data?: DialogExternal) => {
    return this.create({ ...data, title: message, type: 'error' });
  };

  success = (message: VNode | string, data?: DialogExternal) => {
    return this.create({ ...data, title: message, type: 'success' });
  };

  info = (message: VNode | string, data?: DialogExternal) => {
    return this.create({ ...data, title: message, type: 'info' });
  };

  warning = (message: VNode | string, data?: DialogExternal) => {
    return this.create({ ...data, title: message, type: 'warning' });
  };

  getDialogs = () => {
    return this.dialogs.filter(dialog => !this.dismissed.has(dialog.id));
  };

  activeDialogs = () => {
    this.dialogs = this.getDialogs();
    this.dismissed.clear();

    return this.dialogs;
  };
}

export const DialogState = new DialogObserver();

const createDialog = DialogState.message;
const getHistory = () => DialogState.dialogs;
const getDialogs = () => DialogState.getDialogs();

export const dialog = Object.assign(createDialog, {
  success: DialogState.success,
  error: DialogState.error,
  info: DialogState.info,
  warning: DialogState.warning,
  getHistory,
  getDialogs
});

function resolveDialogId(id?: number | string) {
  return typeof id === 'number' || (typeof id === 'string' && id.length > 0) ? id : dialogsCounter++;
}
