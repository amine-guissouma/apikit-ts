import { beforeEach, describe, expect, it } from "vitest";
import { z } from "zod";
import axios, {AxiosError} from "axios";

import { errorNormalizer } from "../../../../src/errors/handler/error-normalizer";
import { ApikitException } from "../../../../src/exception/apikit-exception";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";
import { BusinessErrorRegistry } from "../../../../src/errors/mapping/business-error-codes";

import { ApikitErrorDefinitions } from "../../../../src/errors/definitions/apikit-error-definitions";
import { AxiosErrorMapper } from "../../../../src/http/axios/axios-error-mapper";
import { HttpStatusMapper } from "../../../../src/http/status/http-status-mapper";
import {expectedAxiosCodes, expectedHttpStatus} from "../../../fixture/expected-mappings";

function test_errorNormalizer_httpStatus(status: number, statusText: string, code: string) {
    const response = {
        status: status,
        statusText: statusText,
        headers: {},
        config: {} as any,
        data: {},
    };

    const error = new axios.AxiosError(
        `Request failed with status code ${status}`,
        code,
        undefined,
        undefined,
        response
    );

    const result = errorNormalizer(error);

    const expected = new ApikitException(HttpStatusMapper[status]);
    expect(result).toEqual(expected);
}

function test_axios_error(message: string, code: string) {
    const axiosError = new axios.AxiosError(message, code);
    const result = errorNormalizer(axiosError);

    const expected = new ApikitException(AxiosErrorMapper[code]);
    expect(result).toEqual(expected);
}


describe("errorNormalizer", () => {

    beforeEach(() => {
        BusinessErrorRegistry.reset();
    });


    // ------------------------------------------------
    // [ERR-NORMALIZER-Apikit_Exception]
    // ------------------------------------------------
    describe("[UT-ERR-NORMALIZER-Apikit_Exception]", () => {
        it(" doit retourner la même ApikitException", () => {

                const exception = new ApikitException(ApikitErrorDefinitions.APIKIT_UNKNOWN_ERROR);

                const result = errorNormalizer(exception);
                expect(result).toBe(exception);
            }
        );
    });


    // ------------------------------------------------
    // [ERR-NORMALIZER-Not_Axios_Error]
    // ------------------------------------------------
    describe("[UT-ERR-NORMALIZER-Not_Axios_Error]", () => {
        it(" doit transformer une erreur inconnue", () => {

                const result = errorNormalizer(new Error("Erreur inconnue"));

                const expected = new ApikitException(ApikitErrorDefinitions.APIKIT_UNKNOWN_ERROR);
                expect(result).toEqual(expected);
        });

        it(" doit transformer une valeur non Error", () => {

                const result = errorNormalizer("Erreur inconnue");

                const expected = new ApikitException(ApikitErrorDefinitions.APIKIT_UNKNOWN_ERROR);
                expect(result).toEqual(expected);
        });
    });

    // ------------------------------------------------
    // [ERR-NORMALIZER-Zod_Error]
    // ------------------------------------------------
    describe("[UT-ERR-NORMALIZER-Zod_Error]", () => {
        it(
            " doit transformer une ZodError",
            () => {

                const schema = z.object({name: z.string(), age: z.number(),});

                const validation = schema.safeParse({name: "Amino", age: "trente",});

                expect(validation.success).toBe(false);
                if (validation.success) {
                    return;
                }

                const result = errorNormalizer(validation.error);

                const expected = new ApikitException(ApikitErrorDefinitions.APIKIT_ZOD_SCHEMA_INVALID, validation.error.issues);
                expect(result).toEqual(expected);
            }
        );
    });


    // ================================================
    // axios
    // ================================================
    describe("[UT-ERR-NORMALIZER-Axios_No_Response]", () => {
        it.each(expectedAxiosCodes)(
            " doit gérer l'erreur Axios sans reponse de type $0 ",
            (code) => {
                test_axios_error('message', code);
            }
        );
    });


    // ------------------------------------------------
    // [ERR-NORMALIZER-Axios_Http_Status]
    // ------------------------------------------------
    describe("[UT-ERR-NORMALIZER-Axios_Http_Status] ", () => {
        it.each(expectedHttpStatus)(
            "doit gérer le statut HTTP $0",
            (status) => {
                test_errorNormalizer_httpStatus(status, "statusText", "code");
            }
        );
    });


    // ------------------------------------------------
    // [ERR-NORMALIZER-Axios_No_Data]
    // ------------------------------------------------
    describe("[UT-ERR-NORMALIZER-Axios_No_Data]", () => {

        it(
            "doit détecter une réponse Axios sans data",
            () => {

                const error = new axios.AxiosError(
                    "Request failed",
                    "ERR_BAD_REQUEST",
                    undefined,
                    undefined,
                    {
                        status: 400,
                        statusText: "Bad Request",
                        headers: {},
                        config: {} as any,
                        data: undefined,
                    }
                );

                const result = errorNormalizer(error);

                const expected = new ApikitException(ApikitErrorDefinitions.APIKIT_MISSING_RESPONSE_DATA_AXIOS);
                expect(result).toEqual(expected);
            }
        );


    });



    // ------------------------------------------------
    // [ERR-NORMALIZER-Axios_No_Error_Contract]
    // ------------------------------------------------
    describe("[UT-ERR-NORMALIZER-Axios_No_Error_Contract]", () => {
        it(" doit détecter un contrat d'erreur invalide", () => {

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

                const expected = new ApikitException(ApikitErrorDefinitions.APIKIT_INVALID_ERROR_CONTRACT);
                expect(result).toEqual(expected);
            }
        );
    });



    // ------------------------------------------------
    // [ERR-NORMALIZER-Api_Error_Response]
    // ------------------------------------------------
    describe("[UT-ERR-NORMALIZER-Api_Error_Response]", () => {
    it(" doit normaliser une erreur API", () => {

            const apiError = {
                code: "USER_NOT_FOUND",
                message: "Utilisateur introuvable",
                details: {
                    userId: 42,
                },
            };

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
                        error: apiError,
                    },
                }
            );

            const result = errorNormalizer(error);

            const expected = new ApikitException(apiError.code, apiError.message, ErrorCategory.SERVER, apiError.details);

            expect(result).toEqual(expected);
        }
    );


    it(" doit utiliser la catégorie métier configurée", () => {

            const apiError = {
                code: "USER_NOT_FOUND",
                message: "Utilisateur introuvable",
                details: {
                    userId: 42,
                },
            };

            BusinessErrorRegistry.set({
                [apiError.code]: ErrorCategory.BUSINESS,
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
                        error: apiError,
                    },
                }
            );

            const result = errorNormalizer(error);

            const expected = new ApikitException(apiError.code, apiError.message, ErrorCategory.BUSINESS, apiError.details);
            expect(result).toEqual(expected);
        }
    );


    it(
        "doit utiliser la définition par défaut lorsque le code est absent",
        () => {

            const apiError = {
                message: "Une erreur est survenue",
                details: {
                    reason: "unknown",
                },
            };

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
                        error: apiError,
                    },
                }
            );

            const result = errorNormalizer(error);

            const expected = new ApikitException(
                {...ApikitErrorDefinitions.APIKIT_UNKNOWN_ERROR_RESPONSE, message: apiError.message,}, apiError.details
            );

            expect(result).toEqual(expected);
        }
    );
    });

});