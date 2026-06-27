import { ErrorCategory } from "./ErrorCategory";

export const ErrorCodeMap: Record<string, ErrorCategory> = {
    // todo plus tard fournir à partir du fichier apikitConfig.ts
    // SFF
    SFF_NOT_FOUND: ErrorCategory.BUSINESS,
    SFF_ALREADY_EXISTS: ErrorCategory.BUSINESS,

    // Validation
    VALIDATION_ERROR: ErrorCategory.BUSINESS,

    // Utilisateur
    USER_NOT_FOUND: ErrorCategory.BUSINESS,

    // Fichier
    FILE_NOT_FOUND: ErrorCategory.BUSINESS,

    // Règle métier
    INVALID_WORKFLOW_STATE: ErrorCategory.BUSINESS,
    // todo for test
};