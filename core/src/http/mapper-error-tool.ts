import {ErrorCategory} from "../errors/enum/ErrorCategory";

export interface ErrorDefinition {
    code: string;
    message: string;
    category: ErrorCategory;
}

const DefaultError = {
    code: "UNKNOWN_CODE_ERROR",
    message: "key could not be found.",
    category: ErrorCategory.UNEXPECTED
};

export const getMappedError = (
    map: Record<  number | string, ErrorDefinition>,
     key?: number | string,
    defaultError: ErrorDefinition = DefaultError
): ErrorDefinition => {

    if (key == null) {
        return defaultError;
    }
    return map[key] ?? defaultError;
};