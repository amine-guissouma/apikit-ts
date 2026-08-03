import {PopupService} from "./ui_conponents/popup/PopupService";
import {ToastService} from "./ui_conponents/toast/ToastService";
import {UiErrorConfig} from "../core/src/errors/errorHandler/ui-config-registry";
import {ApikitException} from "../core/src/api/apikit-exception";

export const UIErrorConfig:UiErrorConfig = {
    dev: (error:ApikitException) => {
        PopupService.open({title: "[ APIKIT GLOBAL ERROR DEV ] ", content: error.message,});
    },
    integ: (error:ApikitException) => {
        PopupService.open({title: "[ APIKIT GLOBAL ERROR INTEG ]", content: error.message,});
    },
    qual: (error:ApikitException) => {
        ToastService.error(`[ APIKIT GLOBAL ERROR QUAL ]:  ${error.message}`);
    },
    prod: (error:ApikitException) => {
        ToastService.error(`[ APIKIT GLOBAL ERROR PROD ]:  ${error.message}`);
    },
};
