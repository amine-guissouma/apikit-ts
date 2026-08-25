import {beforeEach, describe, expect, it} from "vitest";
import { z } from "zod";
import axios from "axios";

import { errorNormalizer } from "../../../../src/errors/handler/error-normalizer";
import { ApikitException } from "../../../../src/exception/apikit-exception";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";
import {BusinessErrorRegistry} from "../../../../src/errors/mapping/business-error-codes";



describe("errorNormalizer", () => {
    beforeEach(() => {
        BusinessErrorRegistry.reset();
    });
    it("doit retourner la même ApikitException", () => {

        const exception = new ApikitException(
            "USER_NOT_FOUND",
            "Utilisateur introuvable",
            ErrorCategory.BUSINESS
        );

        const result = errorNormalizer(exception);

        expect(result).toBe(exception);
    });


    it("doit transformer une erreur inconnue en ApikitException", () => {

        const result = errorNormalizer(
            new Error("Erreur inconnue")
        );

        expect(result).toBeInstanceOf(ApikitException);

        expect(result.code).toBe("APIKIT_UNKNOWN_ERROR");
        expect(result.errorType).toBe(ErrorCategory.UNEXPECTED);
    });


    it("doit transformer une valeur non Error en ApikitException", () => {

        const result = errorNormalizer("Erreur inconnue");

        expect(result).toBeInstanceOf(ApikitException);

        expect(result.code).toBe("APIKIT_UNKNOWN_ERROR");
        expect(result.errorType).toBe(ErrorCategory.UNEXPECTED);
    });
    it("doit transformer une ZodError en ApikitException CONTRACT", () => {

        const schema = z.object({
            name: z.string(),
            age: z.number(),
        });

        const validation = schema.safeParse({
            name: "Amino",
            age: "trente",
        });

        expect(validation.success).toBe(false);

        if (validation.success) {
            return;
        }

        const result = errorNormalizer(validation.error);

        expect(result).toBeInstanceOf(ApikitException);

        expect(result.code).toBe("APIKIT_ZOD_SCHEMA_INVALID");
        expect(result.errorType).toBe(ErrorCategory.CONTRACT);
        expect(result.message).toBe("API contract violation");

        expect(result.details).toEqual(validation.error.issues);
    });

    it("doit transformer une erreur Axios réseau", () => {

        const axiosError = new axios.AxiosError(
            "Network Error",
            "ERR_NETWORK"
        );

        const result = errorNormalizer(axiosError);

        expect(result).toBeInstanceOf(ApikitException);

        expect(result.code).toBe("APIKIT_NETWORK_ERROR");

        expect(result.message).toBe(
            "Impossible de joindre le serveur."
        );

        expect(result.errorType).toBe(
            ErrorCategory.TECHNICAL
        );
    });

    it("doit transformer une erreur Axios de timeout", () => {

        const axiosError = new axios.AxiosError(
            "timeout",
            "ECONNABORTED"
        );

        const result = errorNormalizer(axiosError);

        expect(result).toBeInstanceOf(ApikitException);

        expect(result.code).toBe(
            "APIKIT_AXIOS_NETWORK_TIMEOUT"
        );

        expect(result.message).toBe(
            "Le délai d'attente du serveur est dépassé."
        );

        expect(result.errorType).toBe(
            ErrorCategory.TECHNICAL
        );
    });

    it("doit transformer une requête Axios annulée", () => {

        const axiosError = new axios.AxiosError(
            "Request canceled",
            "ERR_CANCELED"
        );

        const result = errorNormalizer(axiosError);

        expect(result).toBeInstanceOf(ApikitException);

        expect(result.code).toBe(
            "APIKIT_AXIOS_REQUEST_CANCELED"
        );

        expect(result.message).toBe(
            "La requête a été annulée."
        );

        expect(result.errorType).toBe(
            ErrorCategory.CANCELLED
        );
    });



    it("doit transformer une erreur Axios 401 en erreur AUTHENTICATION", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 401",
            "ERR_BAD_REQUEST",
            undefined,
            undefined,
            {
                status: 401,
                statusText: "Unauthorized",
                headers: {},
                config: {} as any,
                data: {},
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("APIKIT_HTTP_401_AUTHENTICATION_ERROR");
        expect(result.errorType).toBe(ErrorCategory.AUTHENTICATION);
    });
    it("doit transformer une erreur Axios 403 en erreur AUTHORIZATION", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 403",
            "ERR_BAD_REQUEST",
            undefined,
            undefined,
            {
                status: 403,
                statusText: "Forbidden",
                headers: {},
                config: {} as any,
                data: {},
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("APIKIT_HTTP_403_AUTHORIZATION_ERROR");
        expect(result.errorType).toBe(ErrorCategory.AUTHORIZATION);
    });

    it("doit transformer une erreur Axios 500 en erreur SERVER_UNEXPECTED", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 500",
            "ERR_BAD_RESPONSE",
            undefined,
            undefined,
            {
                status: 500,
                statusText: "Internal Server Error",
                headers: {},
                config: {} as any,
                data: {},
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("APIKIT_HTTP_500_UNKNOWN_SERVER_ERROR");
        expect(result.errorType).toBe(ErrorCategory.SERVER_UNEXPECTED);
    });
    it("doit transformer une erreur Axios 502 en erreur SERVER_UNAVAILABLE", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 502",
            "ERR_BAD_RESPONSE",
            undefined,
            undefined,
            {
                status: 502,
                statusText: "Bad Gateway",
                headers: {},
                config: {} as any,
                data: {},
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("APIKIT_HTTP_502_PROXY_GATEWAY_ERROR");
        expect(result.errorType).toBe(ErrorCategory.SERVER_UNAVAILABLE);
    });

    it("doit transformer une erreur Axios 503 en erreur SERVER_UNAVAILABLE", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 503",
            "ERR_BAD_RESPONSE",
            undefined,
            undefined,
            {
                status: 503,
                statusText: "Service Unavailable",
                headers: {},
                config: {} as any,
                data: {},
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("APIKIT_HTTP_503_SERVICE_UNAVAILABLE");
        expect(result.errorType).toBe(ErrorCategory.SERVER_UNAVAILABLE);
    });

    it("doit transformer une erreur Axios 504 en erreur SERVER_UNAVAILABLE", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 504",
            "ERR_BAD_RESPONSE",
            undefined,
            undefined,
            {
                status: 504,
                statusText: "Gateway Timeout",
                headers: {},
                config: {} as any,
                data: {},
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("APIKIT_HTTP_504_TIMEOUT");
        expect(result.errorType).toBe(ErrorCategory.SERVER_UNAVAILABLE);
    });

    it("doit transformer une erreur Axios HTTP inconnue avec un contrat ApiKit valide", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 400",
            "ERR_BAD_REQUEST",
            undefined,
            undefined,
            {
                status: 400,
                statusText: "Bad Request",
                headers: {},
                config: {} as any,
                data: {
                    error: {
                        code: "USER_NOT_FOUND",
                        message: "Utilisateur introuvable",
                        details: {
                            userId: 42,
                        },
                    },
                },
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("USER_NOT_FOUND");
        expect(result.message).toBe("Utilisateur introuvable");
        expect(result.errorType).toBe(ErrorCategory.SERVER);
        expect(result.details).toEqual({
            userId: 42,
        });
    })

    it("doit détecter un contrat d'erreur ApiKit invalide", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 400",
            "ERR_BAD_REQUEST",
            undefined,
            undefined,
            {
                status: 400,
                statusText: "Bad Request",
                headers: {},
                config: {} as any,
                data: {
                    message: "Erreur serveur",
                },
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("APIKIT_INVALID_ERROR_CONTRACT");
        expect(result.message).toBe(
            "data est absent du contrat d'erreur"
        );
        expect(result.errorType).toBe(ErrorCategory.CONTRACT);
    });
    it("doit utiliser la catégorie métier configurée pour une erreur serveur", () => {
        BusinessErrorRegistry.set({
            USER_NOT_FOUND: ErrorCategory.BUSINESS,
        });

        const error = new axios.AxiosError(
            "Request failed with status code 400",
            "ERR_BAD_REQUEST",
            undefined,
            undefined,
            {
                status: 400,
                statusText: "Bad Request",
                headers: {},
                config: {} as any,
                data: {
                    error: {
                        code: "USER_NOT_FOUND",
                        message: "Utilisateur introuvable",
                        details: {
                            userId: 42,
                        },
                    },
                },
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("USER_NOT_FOUND");
        expect(result.message).toBe("Utilisateur introuvable");
        expect(result.errorType).toBe(ErrorCategory.BUSINESS);
        expect(result.details).toEqual({
            userId: 42,
        });
    });

    it("doit utiliser un code par défaut si le code d'erreur est absent", () => {
        const error = new axios.AxiosError(
            "Request failed with status code 400",
            "ERR_BAD_REQUEST",
            undefined,
            undefined,
            {
                status: 400,
                statusText: "Bad Request",
                headers: {},
                config: {} as any,
                data: {
                    error: {
                        message: "Une erreur est survenue",
                        details: {
                            reason: "unknown",
                        },
                    },
                },
            }
        );

        const result = errorNormalizer(error);

        expect(result).toBeInstanceOf(ApikitException);
        expect(result.code).toBe("APIKIT_UNKNOWN_ERROR_RESPONSE");
        expect(result.message).toBe("Une erreur est survenue");
        expect(result.errorType).toBe(ErrorCategory.SERVER);
        expect(result.details).toEqual({
            reason: "unknown",
        });
    });
});