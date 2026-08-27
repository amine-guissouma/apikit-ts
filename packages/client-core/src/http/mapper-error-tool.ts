import {ErrorCategory} from "../errors/enum/ErrorCategory";
import {ApikitErrorDefinitions} from "../errors/definitions/apikit-error-definitions";

export interface ErrorDefinition {
    code: string;
    message: string;
    category: ErrorCategory;
}


export const getMappedError = (
    map: Record<  number | string, ErrorDefinition>,
     key?: number | string,
    defaultError: ErrorDefinition = ApikitErrorDefinitions.APIKIT_UNKNOWN_CODE_ERROR
): ErrorDefinition => {

    if (key == null) {
        return defaultError;
    }
    return map[key] ?? defaultError;
};