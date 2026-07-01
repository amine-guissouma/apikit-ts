export interface ErrorDefinition {
    code: string;
    message: string;
}

export const getMappedError = (
    map: Record<string, ErrorDefinition>,
    key?: string,
    defaultError: ErrorDefinition = {
        code: "UNKNOWN_ERROR",
        message: "Une erreur inconnue est survenue.",
    }
): ErrorDefinition => {

    if (!key) {
        return defaultError;
    }
    return map[key] ?? defaultError;
};