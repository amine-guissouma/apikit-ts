import {ErrorCategory} from "../../errors/enum/ErrorCategory";
import {ErrorDefinition} from "../mapper-error-tool";

export const AxiosErrorMapper: Record<string, ErrorDefinition> = {
    // =========================
    // NETWORK
    // =========================
    ERR_NETWORK: {
        code: "APIKIT_NETWORK_ERROR",
        message: "Impossible de joindre le serveur.",
        category: ErrorCategory.TECHNICAL

    },

    ECONNABORTED: {
        code: "APIKIT_AXIOS_NETWORK_TIMEOUT",
        message: "Le délai d'attente du serveur est dépassé.",
        category: ErrorCategory.TECHNICAL

    },
    // =========================
    // CLIENT CONTROL
    // =========================
    ERR_CANCELED: {
        code: "APIKIT_AXIOS_REQUEST_CANCELED",
        message: "La requête a été annulée.",
        category: ErrorCategory.CANCELLED
    },

    ERR_INVALID_URL: {
        code: "APIKIT_AXIOS_INVALID_URL",
        message: "URL du serveur invalide.",
        category: ErrorCategory.TECHNICAL

    },
    // =========================
    // CONFIG / SDK USAGE
    // =========================
    ERR_BAD_REQUEST: {
        code: "APIKIT_AXIOS_BAD_REQUEST",
        message: "Requête HTTP invalide.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_BAD_RESPONSE: {
        code: "APIKIT_AXIOS_BAD_RESPONSE",
        message: "Réponse HTTP invalide.",
        category: ErrorCategory.TECHNICAL
    },
    // =========================
    // HTTP / SERVER RESPONSE
    // =========================
    ERR_FR_TOO_MANY_REDIRECTS: {
        code: "APIKIT_AXIOS_TOO_MANY_REDIRECTS",
        message: "Trop de redirections.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_NOT_SUPPORT: {
        code: "APIKIT_AXIOS_NOT_SUPPORTED",
        message: "Fonction HTTP non supportée.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_DEPRECATED: {
        code: "APIKIT_AXIOS_DEPRECATED",
        message: "Fonction Axios obsolète.",
        category: ErrorCategory.TECHNICAL
    },
} as const;