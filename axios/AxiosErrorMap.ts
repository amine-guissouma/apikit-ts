export const AxiosErrorMap = {
    // =========================
    // NETWORK
    // =========================
    ERR_NETWORK: {
        code: "APIKIT_NETWORK_ERROR",
        message: "Impossible de joindre le serveur.",
    },

    ECONNABORTED: {
        code: "APIKIT_NETWORK_TIMEOUT",
        message: "Le délai d'attente du serveur est dépassé.",
    },
    // =========================
    // CLIENT CONTROL
    // =========================
    ERR_CANCELED: {
        code: "APIKIT_REQUEST_CANCELED",
        message: "La requête a été annulée.",
    },

    ERR_INVALID_URL: {
        code: "APIKIT_INVALID_URL",
        message: "URL du serveur invalide.",
    },
    // =========================
    // CONFIG / SDK USAGE
    // =========================
    ERR_BAD_REQUEST: {
        code: "APIKIT_BAD_REQUEST",
        message: "Requête HTTP invalide.",
    },

    ERR_BAD_RESPONSE: {
        code: "APIKIT_BAD_RESPONSE",
        message: "Réponse HTTP invalide.",
    },
    // =========================
    // HTTP / SERVER RESPONSE
    // =========================
    ERR_FR_TOO_MANY_REDIRECTS: {
        code: "APIKIT_TOO_MANY_REDIRECTS",
        message: "Trop de redirections.",
    },

    ERR_NOT_SUPPORT: {
        code: "APIKIT_NOT_SUPPORTED",
        message: "Fonction HTTP non supportée.",
    },

    ERR_DEPRECATED: {
        code: "APIKIT_DEPRECATED",
        message: "Fonction Axios obsolète.",
    },
} as const;