import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    ReactNode,
} from "react";

import {
    Alert,
    Stack,
    Fade,
    Collapse,
} from "@mui/material";
import { useEffect } from "react";
import { ToastService } from "./ToastService";
/* =========================
   ENUM
========================= */
export enum ToastSeverity {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
}

/* =========================
   TYPES
========================= */
interface ToastItem {
    id: string;
    message: string;
    severity: ToastSeverity;
    open: boolean;
}

interface ToastContextType {
    success: (msg: string) => void;
    error: (msg: string) => void;
    warning: (msg: string) => void;
    info: (msg: string) => void;
}

/* =========================
   CONTEXT
========================= */
const ToastContext = createContext<ToastContextType | null>(null);

/* =========================
   PROVIDER
========================= */
export function GlobalToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback(
        (message: string, severity: ToastSeverity) => {
            const id = crypto.randomUUID();

            const toast: ToastItem = {
                id,
                message,
                severity,
                open: true,
            };

            setToasts((prev) => [...prev, toast]);

            // fermeture avec animation
            setTimeout(() => {
                setToasts((prev) =>
                    prev.map((t) =>
                        t.id === id ? { ...t, open: false } : t
                    )
                );

                // suppression après animation
                setTimeout(() => {
                    setToasts((prev) =>
                        prev.filter((t) => t.id !== id)
                    );
                }, 300);
            }, 3000);
        },
        []
    );

    const removeToast = useCallback((id: string) => {
        setToasts((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, open: false } : t
            )
        );

        setTimeout(() => {
            setToasts((prev) =>
                prev.filter((t) => t.id !== id)
            );
        }, 300);
    }, []);

    const value = useMemo(() => ({
            success: (msg: string) => addToast(msg, ToastSeverity.SUCCESS),
            error: (msg: string) => addToast(msg, ToastSeverity.ERROR),
            warning: (msg: string) => addToast(msg, ToastSeverity.WARNING),
            info: (msg: string) => addToast(msg, ToastSeverity.INFO),
        }),
        [addToast]
    );
    useEffect(() => {
        ToastService.register(value);
    }, [value]);
    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* STACK GLOBAL */}
            <Stack
                spacing={1}
                sx={{position: "fixed", bottom: 16, right: 16, zIndex: 9999, flexDirection: "column-reverse",}}
            >
                {toasts.map((toast) => (
                    <Collapse key={toast.id} in={toast.open} timeout={{enter: 300, exit: 300,}} unmountOnExit>
                        <Fade in={toast.open} timeout={300}>
                            <div>
                                <Alert
                                    severity={toast.severity}
                                    variant="filled"
                                    onClose={() =>removeToast(toast.id)}
                                    sx={{width: 320, boxShadow: 3,}}
                                >
                                    {toast.message}
                                </Alert>
                            </div>
                        </Fade>
                    </Collapse>
                ))}
            </Stack>
        </ToastContext.Provider>
    );
}

/* =========================
   HOOK
========================= */
export function UseToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}