import {ErrorCategory} from "../../errors/enum/ErrorCategory";
import {ErrorDefinition} from "../mapper-error-tool";


export const HttpStatusMapper: Record<number, ErrorDefinition> = {
    401: {
        code: "APIKIT_HTTP_401_AUTHENTICATION_ERROR",
        message: "Token expiré.",
        category: ErrorCategory.AUTHENTICATION,
    },
    403: {
        code: "APIKIT_HTTP_403_AUTHORIZATION_ERROR",
        message: "Accès interdit.",
        category: ErrorCategory.AUTHORIZATION,
    },
    500: {
        code: "APIKIT_HTTP_500_UNKNOWN_SERVER_ERROR",
        message: "Une erreur inattendue est survenue.",
        category: ErrorCategory.SERVER_UNEXPECTED,
    },
    502: {
        code: "APIKIT_HTTP_502_PROXY_GATEWAY_ERROR",
        message: "Infrastructure ou communication.",
        category: ErrorCategory.SERVER_UNAVAILABLE,
    },
    503: {
        code: "APIKIT_HTTP_503_SERVICE_UNAVAILABLE",
        message: "Service indisponible.",
        category: ErrorCategory.SERVER_UNAVAILABLE,
    },
    504: {
        code: "APIKIT_HTTP_504_TIMEOUT",
        message: "Infrastructure ou communication.",
        category: ErrorCategory.SERVER_UNAVAILABLE,
    },
};