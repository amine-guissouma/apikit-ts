import {ApikitException} from "../api/apikit-exception";
import {ERROR_LEVEL} from "../apikit-config";
import {ErrorLevelVisibility} from "./enum/ErrorLevelVisibility";
import {PopupService} from "../../components/info/popup/PopupService";
import {ToastService} from "../../components/info/toast/ToastService";


const GLOBAL_ERROR = "[APIKIT GLOBAL ERROR]";
export const handleGlobalError = (error: ApikitException):void => {
    switch (ERROR_LEVEL) {
        case ErrorLevelVisibility.DEV:
            PopupService.open({title: error.code, content: error.message,});
            console.log("error DEV");
            console.error(GLOBAL_ERROR, error.code, error.message);
            ToastService.error(error.message);
            break;
        case ErrorLevelVisibility.INTEG:
            console.log("error INTEG");
            console.error(GLOBAL_ERROR, error.code, error.message);
            break;

        case ErrorLevelVisibility.QUAL:
            console.log("error QUAL");
            ToastService.error(error.message);
            console.error(GLOBAL_ERROR, error.code, error.message);
            break;

        case ErrorLevelVisibility.PROD:
            ToastService.error(error.message);
            console.log("error PROD");
            console.error(GLOBAL_ERROR, error.code, error.message);
            break;
    }
};