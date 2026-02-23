import { ref } from 'vue';

export interface SnackbarOptions {
  type?: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface Snackbar extends SnackbarOptions {
  id: number;
  show: boolean;
}

const snackbars = ref<Snackbar[]>([]);
let nextId = 0;

export function useSnackbar() {
  const enqueueSnackbar = (options: SnackbarOptions) => {
    const id = nextId++;
    const snackbar: Snackbar = {
      id,
      show: true,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration ?? 5000,
      closable: options.closable ?? true,
      actionLabel: options.actionLabel,
      onAction: options.onAction
    };

    snackbars.value.push(snackbar);

    // Auto-remove after duration
    const duration = snackbar.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        closeSnackbar(id);
      }, duration);
    }

    return id;
  };

  const closeSnackbar = (id: number) => {
    snackbars.value = snackbars.value.filter(s => s.id !== id);
  };

  const clearAll = () => {
    snackbars.value = [];
  };

  return {
    snackbars,
    enqueueSnackbar,
    closeSnackbar,
    clearAll
  };
}
