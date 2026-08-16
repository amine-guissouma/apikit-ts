import { AlertSeverity } from "./GlobalAlertProvider";

export interface AlertOptions {
    severity: AlertSeverity;
    title?: string;
    message: string;
}

type OpenAlertFn = (options: AlertOptions) => void;

class AlertServiceClass {

    private openAlert?: OpenAlertFn;

    register(openAlert: OpenAlertFn) {
        this.openAlert = openAlert;
    }

    unregister() {
        this.openAlert = undefined;
    }

    open(options: AlertOptions) {
        this.openAlert?.(options);
    }

    success(title: string, message: string) {
        this.open({
            severity: AlertSeverity.SUCCESS,
            title,
            message
        });
    }

    warning(title: string, message: string) {
        this.open({
            severity: AlertSeverity.WARNING,
            title,
            message
        });
    }

    error(title: string, message: string) {
        this.open({
            severity: AlertSeverity.ERROR,
            title,
            message
        });
    }

    info(title: string, message: string) {
        this.open({
            severity: AlertSeverity.INFO,
            title,
            message
        });
    }
}

export const AlertService = new AlertServiceClass();