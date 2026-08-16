import { ReactNode } from "react";

type OpenPopupFn = (options: {
    title?: string;
    content: ReactNode;
}) => void;

class PopupServiceClass {

    private openPopup?: OpenPopupFn;

    register(openPopup: OpenPopupFn) {
        this.openPopup = openPopup;
    }

    open(options: {
        title?: string;
        content: ReactNode;
    }) {
        this.openPopup?.(options);
    }
}

export const PopupService = new PopupServiceClass();


