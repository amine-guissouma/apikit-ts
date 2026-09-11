import { ErrorCategory } from "../enum/ErrorCategory";
import {ErrorDefinition} from "../../http/mapper-error-tool";
import {ApikitErrorCode} from "./enum/apikit-error-code";

export const ApikitErrorDefinitions: Record<string, ErrorDefinition> = {

    // normaliser
    APIKIT_ZOD_SCHEMA_INVALID: {
        code: ApikitErrorCode.APIKIT_ZOD_SCHEMA_INVALID,
        message: "API contract violation",
        category: ErrorCategory.CONTRACT
    },

    APIKIT_UNKNOWN_ERROR: {
        code: ApikitErrorCode.APIKIT_UNKNOWN_ERROR,
        message: "Une erreur service non controlée.",
        category: ErrorCategory.UNEXPECTED
    },

    APIKIT_MISSING_RESPONSE_DATA_AXIOS: {
        code: ApikitErrorCode.APIKIT_MISSING_RESPONSE_DATA_AXIOS,
        message: "data est absent de la réponse",
        category: ErrorCategory.CONTRACT
    },

    APIKIT_INVALID_ERROR_CONTRACT: {
        code: ApikitErrorCode.APIKIT_INVALID_ERROR_CONTRACT,
        message: "error est absent du contrat d'erreur",
        category: ErrorCategory.CONTRACT
    },

    APIKIT_UNKNOWN_ERROR_RESPONSE: {
        code: ApikitErrorCode.APIKIT_UNKNOWN_ERROR_RESPONSE,
        message: "API Error",
        category: ErrorCategory.SERVER
    },
    APIKIT_AXIOS_NETWORK_UNKNOWN_ERROR: {
        code: ApikitErrorCode.APIKIT_AXIOS_NETWORK_UNKNOWN_ERROR,
        message: "Network error",
        category: ErrorCategory.TECHNICAL
    },
    // getMappedError (default)
    APIKIT_UNKNOWN_CODE_ERROR: {
        code: ApikitErrorCode.APIKIT_UNKNOWN_CODE_ERROR,
        message: "key could not be found.",
        category: ErrorCategory.UNEXPECTED
    },

    // unwrapper
    APIKIT_RESPONSE_INVALID: {
        code: ApikitErrorCode.APIKIT_RESPONSE_INVALID,
        message: "Invalid Apikit response format",
        category: ErrorCategory.CONTRACT
    },

    APIKIT_ERROR_MALFORMED: {
        code: ApikitErrorCode.APIKIT_ERROR_MALFORMED,
        message: "Malformed API error response",
        category: ErrorCategory.CONTRACT
    },

    APIKIT_DATA_MISSING: {
        code: ApikitErrorCode.APIKIT_DATA_MISSING,
        message: "Successful API response has no data",
        category: ErrorCategory.CONTRACT
    }

};
