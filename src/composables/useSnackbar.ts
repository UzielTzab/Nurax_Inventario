import { ref } from 'vue';

export interface SnackbarOptions {
  type?: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
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
      closable: options.closable ?? true
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
    const index = snackbars.value.findIndex(s => s.id === id);
    if (index !== -1) {
      const snackbar = snackbars.value[index];
      if (snackbar) {
        snackbar.show = false;
        // Remove from array after animation
        setTimeout(() => {
          snackbars.value = snackbars.value.filter(s => s.id !== id);
        }, 300);
      }
    }
  };

  const clearAll = () => {
    snackbars.value.forEach(s => s.show = false);
    setTimeout(() => {
      snackbars.value = [];
    }, 300);
  };

  return {
    snackbars,
    enqueueSnackbar,
    closeSnackbar,
    clearAll
  };
}
