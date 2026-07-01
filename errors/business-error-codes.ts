import { ErrorCategory } from "./enum/ErrorCategory";

export const BusinessErrorCodes: Record<string, ErrorCategory> = {
    // todo plus tard fournir à partir du fichier apikit-config.ts
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