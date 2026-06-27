import { ErrorCategory } from "./ErrorCategory";
import { ErrorCodeMap } from "./ErrorCodeMap";

export const errorClassify = (
    code?: string
): ErrorCategory => {
    if (code && code in ErrorCodeMap) {
        return ErrorCategory.BUSINESS;
    }
    return ErrorCategory.GLOBAL;
};