import {ApikitException} from "../api/apikit-exception";
import {ErrorLevelVisibility} from "./enum/ErrorLevelVisibility";
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

    // 2. DEFAULT BEHAVIOR
    switch (error_level) {
        case ErrorLevelVisibility.DEV:
            console.log(`[ ${GLOBAL_ERROR} DEV ]`);
            console.error(GLOBAL_ERROR, error.code, error.message);
            if (error.details) {
                console.error(error.details);
            }
            break;

        case ErrorLevelVisibility.INTEG:
            console.log(`[ ${GLOBAL_ERROR} INTEG ]`);
            console.error(GLOBAL_ERROR, error.code, error.message);
            if (error.details) {
                console.error(error.details);
            }
            break;

        case ErrorLevelVisibility.QUAL:
            console.log(`[ ${GLOBAL_ERROR} QUAL ]`);
            console.error(GLOBAL_ERROR, error.code, error.message);
            break;

        case ErrorLevelVisibility.PROD:
            console.log(`[ ${GLOBAL_ERROR} PROD ]`);
            console.error(GLOBAL_ERROR, error.code, error.message);
            break;
    }
};