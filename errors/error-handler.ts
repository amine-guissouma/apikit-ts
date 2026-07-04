import {ApikitException} from "../api/apikit-exception";
import {ErrorLevelVisibility} from "./enum/ErrorLevelVisibility";
import {PopupService} from "../../components/info/popup/PopupService";
import {ToastService} from "../../components/info/toast/ToastService";
import {UIErrorConfigRegistry} from "./errorHandler/ui-config-registry";
import {UIErrorLevelRegistry} from "./errorHandler/ui-error-level-manager";


const GLOBAL_ERROR = "[APIKIT GLOBAL ERROR]";
export const handleGlobalError = (error: ApikitException):void => {

    // 1. CHECK OVERRIDE USER
    const error_level = UIErrorLevelRegistry.get();
    const customHandler = UIErrorConfigRegistry.get(error_level);
    if (customHandler) {
        customHandler(error);
        return; // IMPORTANT: on stop tout ici
    }

    // 2. DEFAULT BEHAVIOR (ton switch original)

    switch (error_level) {
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