import { describe, expect, it, vi, beforeEach } from "vitest";
import { z } from "zod";

import { ApikitHookRegistry } from "../../../src/config/apikit-hook-registry";
import { apikitRequest } from "../../../src/public/apikit-axio-client";
import { api } from "../../../src/http/axios/axio-client";
import {AxiosError} from "axios";
import {ErrorCategory} from "../../../src/errors/enum/ErrorCategory";
import {ApikitException} from "../../../src/exception/apikit-exception";
import * as ErrorHandler from "../../../src/errors/handler/error-handler";
import {BusinessErrorRegistry} from "../../../src/errors/mapping/business-error-codes";



describe("apikitRequest", () => {

    beforeEach(() => {
        vi.restoreAllMocks();

        ApikitHookRegistry.set({
            beforeRequest: [],
            afterResponse: [],
            onError: [],
        });
    });

    it("doit retourner les data d'une réponse ApiKit valide", async () => {

        vi.spyOn(api, "request").mockResolvedValue({
            data: {
                success: true,
                message: "OK",
                data: {
                    id: 1,
                    name: "Alice",
                },
            },
        } as any);

        const result = await apikitRequest(
            "GET",
            "/users/1"
        );

        expect(result).toEqual({
            id: 1,
            name: "Alice",
        });
    });

    it("doit valider les data avec un schema Zod", async () => {

        vi.spyOn(api, "request").mockResolvedValue({
            data: {
                success: true,
                message: "OK",
                data: {
                    id: 1,
                    name: "Alice",
                },
            },
        } as any);

        const schema = z.object({
            id: z.number(),
            name: z.string(),
        });

        const result = await apikitRequest(
            "GET",
            "/users/1",
            {},
            schema
        );

        expect(result).toEqual({
            id: 1,
            name: "Alice",
        });
    });


    it("doit lever une erreur CONTRACT si les data ne respectent pas le schema", async () => {

        vi.spyOn(api, "request").mockResolvedValue({
            data: {
                success: true,
                message: "OK",
                data: {
                    id: "1",
                    name: "Alice",
                },
            },
        } as any);

        const schema = z.object({
            id: z.number(),
            name: z.string(),
        });

        await expect(
            apikitRequest(
                "GET",
                "/users/1",
                {},
                schema
            )
        ).rejects.toMatchObject({
            errorType: "CONTRACT",
        });
    });

    it("doit exécuter le hooks beforeRequest avant la requête", async () => {

        const beforeRequest = vi.fn((config) => ({
            ...config,
            headers: {
                ...config.headers,
                Authorization: "Bearer test-token",
            },
        }));

        vi.spyOn(api, "request").mockResolvedValue({
            data: {
                success: true,
                message: "OK",
                data: "result",
            },
        } as any);

        ApikitHookRegistry.set({
            beforeRequest: [beforeRequest],
        });

        await apikitRequest(
            "GET",
            "/test"
        );

        expect(beforeRequest).toHaveBeenCalledTimes(1);

        expect(api.request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer test-token",
                }),
            })
        );
    });

    it("doit exécuter les beforeRequest dans l'ordre", async () => {

        const execution: string[] = [];

        const firstHook = vi.fn((config) => {
            execution.push("first");

            return {
                ...config,
                headers: {
                    ...config.headers,
                    "X-First": "1",
                },
            };
        });

        const secondHook = vi.fn((config) => {
            execution.push("second");

            return {
                ...config,
                headers: {
                    ...config.headers,
                    "X-Second": "2",
                },
            };
        });

        vi.spyOn(api, "request").mockResolvedValue({
            data: {
                success: true,
                message: "OK",
                data: "result",
            },
        } as any);

        ApikitHookRegistry.set({
            beforeRequest: [
                firstHook,
                secondHook,
            ],
        });

        await apikitRequest(
            "GET",
            "/test"
        );

        expect(execution).toEqual([
            "first",
            "second",
        ]);

        expect(firstHook).toHaveBeenCalledTimes(1);
        expect(secondHook).toHaveBeenCalledTimes(1);

        expect(api.request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    "X-First": "1",
                    "X-Second": "2",
                }),
            })
        );
    });

    it("doit exécuter le hooks afterResponse après la requête", async () => {

        const afterResponse = vi.fn((response) => ({
            ...response,
            data: {
                ...response.data,
                data: "modified",
            },
        }));

        vi.spyOn(api, "request").mockResolvedValue({
            data: {
                success: true,
                message: "OK",
                data: "original",
            },
        } as any);

        ApikitHookRegistry.set({
            afterResponse: [afterResponse],
        });

        const result = await apikitRequest(
            "GET",
            "/test"
        );

        expect(afterResponse).toHaveBeenCalledTimes(1);

        expect(result).toBe("modified");
    });


    it("doit exécuter les afterResponse dans l'ordre", async () => {

        const execution: string[] = [];

        const firstHook = vi.fn((response) => {
            execution.push("first");

            return {
                ...response,
                data: {
                    ...response.data,
                    data: "first-result",
                },
            };
        });

        const secondHook = vi.fn((response) => {
            execution.push("second");

            return {
                ...response,
                data: {
                    ...response.data,
                    data: `${response.data.data}-second`,
                },
            };
        });

        vi.spyOn(api, "request").mockResolvedValue({
            data: {
                success: true,
                message: "OK",
                data: "original",
            },
        } as any);

        ApikitHookRegistry.set({
            afterResponse: [
                firstHook,
                secondHook,
            ],
        });

        const result = await apikitRequest(
            "GET",
            "/test"
        );

        expect(execution).toEqual([
            "first",
            "second",
        ]);

        expect(firstHook).toHaveBeenCalledTimes(1);
        expect(secondHook).toHaveBeenCalledTimes(1);

        expect(result).toBe("first-result-second");
    });

    it("doit normaliser une erreur Axios en ApikitException", async () => {

        const axiosError = new AxiosError(
            "Network Error",
            "ERR_NETWORK"
        );

        vi.spyOn(api, "request").mockRejectedValue(axiosError);

        await expect(
            apikitRequest("GET", "/test")
        ).rejects.toMatchObject({
            code: "APIKIT_NETWORK_ERROR",
            errorType: ErrorCategory.TECHNICAL,
        });
    });

    it("doit exécuter le hooks onError après normalisation", async () => {

        const axiosError = new AxiosError(
            "Network Error",
            "ERR_NETWORK"
        );

        const onError = vi.fn((error) => error);

        vi.spyOn(api, "request").mockRejectedValue(axiosError);

        ApikitHookRegistry.set({
            onError: [onError],
        });

        await expect(
            apikitRequest("GET", "/test")
        ).rejects.toBeInstanceOf(ApikitException);

        expect(onError).toHaveBeenCalledTimes(1);

        expect(onError).toHaveBeenCalledWith(
            expect.objectContaining({
                code: "APIKIT_NETWORK_ERROR",
                errorType: ErrorCategory.TECHNICAL,
            })
        );
    });

    it("doit utiliser l'exception retournée par le hooks onError", async () => {

        const axiosError = new AxiosError(
            "Network Error",
            "ERR_NETWORK"
        );

        const onError = vi.fn((error) => {
            return new ApikitException(
                "CUSTOM_ERROR",
                "Erreur personnalisée",
                ErrorCategory.UNEXPECTED,
                {
                    source: "onError",
                }
            );
        });

        vi.spyOn(api, "request").mockRejectedValue(axiosError);

        ApikitHookRegistry.set({
            onError: [onError],
        });

        await expect(
            apikitRequest("GET", "/test")
        ).rejects.toMatchObject({
            code: "CUSTOM_ERROR",
            message: "Erreur personnalisée",
            errorType: ErrorCategory.UNEXPECTED,
            details: {
                source: "onError",
            },
        });

        expect(onError).toHaveBeenCalledTimes(1);
    });

    it("doit normaliser une erreur lancée par un hooks onError", async () => {

        const axiosError = new AxiosError(
            "Network Error",
            "ERR_NETWORK"
        );

        const onError = vi.fn(() => {
            throw new Error("Erreur dans le hooks");
        });

        vi.spyOn(api, "request").mockRejectedValue(axiosError);

        ApikitHookRegistry.set({
            onError: [onError],
        });

        await expect(
            apikitRequest("GET", "/test")
        ).rejects.toMatchObject({
            code: "APIKIT_UNKNOWN_ERROR",
            errorType: ErrorCategory.UNEXPECTED,
        });

        expect(onError).toHaveBeenCalledTimes(1);
    });


    it("doit appeler handleGlobalError pour une erreur globale", async () => {

        const axiosError = new AxiosError(
            "Network Error",
            "ERR_NETWORK"
        );

        const handleGlobalErrorSpy = vi
            .spyOn(ErrorHandler, "handleGlobalError")
            .mockImplementation(() => {});

        vi.spyOn(api, "request").mockRejectedValue(axiosError);

        await expect(
            apikitRequest("GET", "/test")
        ).rejects.toBeInstanceOf(ApikitException);

        expect(handleGlobalErrorSpy).toHaveBeenCalledTimes(1);
    });


    it("ne doit pas appeler handleGlobalError pour une erreur BUSINESS", async () => {

        const axiosError = new AxiosError(
            "Business error"
        );

        axiosError.response = {
            status: 400,
            data: {
                success: false,
                message: "Erreur métier",
                error: {
                    code: "USER_ALREADY_EXISTS",
                    message: "Cet utilisateur existe déjà",
                },
            },
        } as any;

        BusinessErrorRegistry.set({
            USER_ALREADY_EXISTS: ErrorCategory.BUSINESS,
        });

        const handleGlobalErrorSpy = vi
            .spyOn(ErrorHandler, "handleGlobalError")
            .mockImplementation(() => {});

        vi.spyOn(api, "request").mockRejectedValue(axiosError);

        await expect(
            apikitRequest("POST", "/users")
        ).rejects.toMatchObject({
            code: "USER_ALREADY_EXISTS",
            errorType: ErrorCategory.BUSINESS,
        });

        expect(handleGlobalErrorSpy).not.toHaveBeenCalled();
    });

});