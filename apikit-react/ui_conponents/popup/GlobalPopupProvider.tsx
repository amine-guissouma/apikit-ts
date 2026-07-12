import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { PopupService } from "./PopupService";

/* =========================
   TYPES
========================= */
interface PopupState {
    open: boolean;
    title?: string;
    content: ReactNode;
}

interface PopupContextType {
    openPopup: (options: {
        title?: string;
        content: ReactNode;
    }) => void;
    closePopup: () => void;
}

/* =========================
   CONTEXT
========================= */
const PopupContext = createContext<PopupContextType | null>(null);

/* =========================
   PROVIDER
========================= */
export function GlobalPopupProvider({children,}: { children: ReactNode; }) {

    const [popup, setPopup] = useState<PopupState>({
        open: false,
        title: "",
        content: null,
    });

    const openPopup = useCallback(
        ({title, content,}: { title?: string; content: ReactNode; }) => {
            setPopup({open: true, title, content,});
        },
        []
    );


    const closePopup = useCallback(() => {
        setPopup((prev) => ({
            ...prev,
            open: false,
        }));
    }, []);

    /**
     * Rend openPopup disponible partout.
     */
    useEffect(() => { PopupService.register(openPopup);}, [openPopup]);

    return (
        <PopupContext.Provider value={{ openPopup, closePopup }}>
            {children}

            {/* POPUP GLOBAL */}
            <Dialog
                open={popup.open}
                onClose={closePopup}
                fullWidth
                maxWidth="sm"
            >
                {popup.title && (
                    <DialogTitle
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        {popup.title}

                        <IconButton onClick={closePopup}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                )}

                <DialogContent dividers>
                    {popup.content}
                </DialogContent>
            </Dialog>
        </PopupContext.Provider>
    );
}

/* =========================
   HOOK
========================= */

export function UsePopup() {

    const context = useContext(PopupContext);

    if (!context) {
        throw new Error(
            "UsePopup must be used inside GlobalPopupProvider"
        );
    }

    return context;
}