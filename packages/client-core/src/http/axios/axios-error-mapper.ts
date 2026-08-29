import {ErrorCategory} from "../../errors/enum/ErrorCategory";
import {ErrorDefinition} from "../mapper-error-tool";
import {ApikitAxiosErrorCode} from "./enum/ApikitAxiosErrorCode";

export const AxiosErrorMapper: Record<string, ErrorDefinition> = {
    // =========================
    // NETWORK
    // =========================
    ERR_NETWORK: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_NETWORK,
        message: "Impossible de joindre le serveur.",
        category: ErrorCategory.TECHNICAL

    },

    ECONNREFUSED: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ECONNREFUSED,
        message: "Impossible de joindre le serveur.",
        category: ErrorCategory.TECHNICAL,
    },

    ECONNABORTED: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ECONNABORTED,
        message: "Le délai d'attente du serveur est dépassé.",
        category: ErrorCategory.TECHNICAL

    },
    // =========================
    // CLIENT CONTROL
    // =========================
    ERR_CANCELED: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_CANCELED,
        message: "La requête a été annulée.",
        category: ErrorCategory.CANCELLED
    },

    ERR_INVALID_URL: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_INVALID_URL,
        message: "URL du serveur invalide.",
        category: ErrorCategory.TECHNICAL

    },
    // =========================
    // CONFIG / SDK USAGE
    // =========================
    ERR_BAD_REQUEST: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_BAD_REQUEST,
        message: "Requête HTTP invalide.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_BAD_RESPONSE: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_BAD_RESPONSE,
        message: "Réponse HTTP invalide.",
        category: ErrorCategory.TECHNICAL
    },
    // =========================
    // HTTP / SERVER RESPONSE
    // =========================
    ERR_FR_TOO_MANY_REDIRECTS: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_FR_TOO_MANY_REDIRECTS,
        message: "Trop de redirections.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_NOT_SUPPORT: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_NOT_SUPPORT,
        message: "Fonction HTTP non supportée.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_DEPRECATED: {
        code:ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_DEPRECATED,
        message: "Fonction Axios obsolète.",
        category: ErrorCategory.TECHNICAL
    },


    ETIMEDOUT: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ETIMEDOUT,
        message: "Le délai d'attente du serveur est dépassé.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_BAD_OPTION: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_BAD_OPTION,
        message: "Configuration de requête invalide.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_BAD_OPTION_VALUE: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_BAD_OPTION_VALUE,
        message: "Valeur de configuration de requête invalide.",
        category: ErrorCategory.TECHNICAL
    },

    ERR_FORM_DATA_DEPTH_EXCEEDED: {
        code: ApikitAxiosErrorCode.APIKIT_AXIOS_ERR_FORM_DATA_DEPTH_EXCEEDED,
        message: "Structure de données de requête trop imbriquée.",
        category: ErrorCategory.TECHNICAL
    },
} as const;