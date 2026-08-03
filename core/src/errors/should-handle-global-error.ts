import {ApikitException} from "../api/apikit-exception";
import {ErrorCategory} from "./enum/ErrorCategory";

export const shouldHandleGlobalError = (
    error: ApikitException
): boolean => {

    switch (error.errorType) {

        case ErrorCategory.BUSINESS:
            return false;

        case ErrorCategory.AUTHENTICATION:
            return false;

        case ErrorCategory.AUTHORIZATION:
            return false;

        default:
            return true;
    }
};