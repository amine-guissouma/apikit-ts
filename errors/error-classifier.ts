import { ErrorCategory } from "./enum/ErrorCategory";
import { BusinessErrorCodes } from "./business-error-codes";

export const errorClassifier = (
    code?: string
): ErrorCategory => {
    if (code && code in BusinessErrorCodes) {
        return ErrorCategory.BUSINESS;
    }
    return ErrorCategory.SERVER_UNHANDLED;
};