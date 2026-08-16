import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from "react";

import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

import { AlertService } from "./AlertService";

export enum AlertSeverity {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
}

interface AlertState {
    open: boolean;
    severity: AlertSeverity;
    title?: string;
    message: string;
}

interface AlertContextType {
    openAlert: (alert: Omit<AlertState, "open">) => void;
    closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function GlobalAlertProvider({
                                        children,
                                    }: {
    children: ReactNode;
}) {

    const [alert, setAlert] = useState<AlertState>({
        open: false,
        severity: AlertSeverity.INFO,
        title: "",
        message: "",
    });

    const openAlert = useCallback(
        (options: Omit<AlertState, "open">) => {
            setAlert({
                ...options,
                open: true,
            });
        },
        []
    );

    const closeAlert = useCallback(() => {
        setAlert((prev) => ({
            ...prev,
            open: false,
        }));
    }, []);

    useEffect(() => {

        AlertService.register(openAlert);

        return () => {
            AlertService.unregister();
        };

    }, [openAlert]);

    return (
        <AlertContext.Provider
            value={{
                openAlert,
                closeAlert,
            }}
        >
            {children}

            <Dialog
                open={alert.open}
                onClose={closeAlert}
                maxWidth="sm"
                fullWidth
            >
                {alert.title && (
                    <DialogTitle>
                        {alert.title}
                    </DialogTitle>
                )}

                <DialogContent>

                    <Alert
                        severity={alert.severity}
                        sx={{ mb: 2 }}
                    >
                        {alert.message}
                    </Alert>

                    {/*
                    <DialogContentText>{alert.message}</DialogContentText>
                    */}
                </DialogContent>

                <DialogActions>

                    <Button onClick={closeAlert}>
                        Fermer
                    </Button>

                </DialogActions>

            </Dialog>

        </AlertContext.Provider>
    );
}

export function useAlert() {

    const context = useContext(AlertContext);

    if (!context) {
        throw new Error(
            "useAlert must be used inside GlobalAlertProvider"
        );
    }

    return context;
}