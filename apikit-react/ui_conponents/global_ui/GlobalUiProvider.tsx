import {GlobalToastProvider} from "../toast/GlobalToastProvider";
import {GlobalPopupProvider} from "../popup/GlobalPopupProvider";
import {GlobalAlertProvider} from "../alert/GlobalAlertProvider";
import {ReactNode} from "react";

export function GlobalUiProvider({ children }: { children: ReactNode }) {
    return (
        <GlobalToastProvider>
            <GlobalPopupProvider>
                <GlobalAlertProvider>
                    {children}
                </GlobalAlertProvider>
            </GlobalPopupProvider>
        </GlobalToastProvider>
    );
}