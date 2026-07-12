type ToastFn = (message: string) => void;

class ToastServiceClass {

    private successFn?: ToastFn;
    private errorFn?: ToastFn;
    private warningFn?: ToastFn;
    private infoFn?: ToastFn;

    register(toast: {
        success: ToastFn;
        error: ToastFn;
        warning: ToastFn;
        info: ToastFn;
    }) {
        this.successFn = toast.success;
        this.errorFn = toast.error;
        this.warningFn = toast.warning;
        this.infoFn = toast.info;
    }

    success(message: string) {
        this.successFn?.(message);
    }

    error(message: string) {
        this.errorFn?.(message);
    }

    warning(message: string) {
        this.warningFn?.(message);
    }

    info(message: string) {
        this.infoFn?.(message);
    }
}

export const ToastService = new ToastServiceClass();