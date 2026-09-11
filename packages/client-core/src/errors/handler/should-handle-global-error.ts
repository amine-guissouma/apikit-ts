import {ApikitException} from "../../exception/apikit-exception";
import {ErrorCategory} from "../enum/ErrorCategory";


const LOCALLY_HANDLED_ERROR_CATEGORIES = [
    ErrorCategory.BUSINESS,
    ErrorCategory.AUTHENTICATION,
    ErrorCategory.AUTHORIZATION,
];

export const shouldHandleGlobalError = (
    error: ApikitException
): boolean => {
    return !LOCALLY_HANDLED_ERROR_CATEGORIES.includes( error.errorType);
};