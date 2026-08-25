import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    apikitExceptionHandler,
} from "../../../src/public/apikit-exception-handler";

import {
    ApikitException,
} from "../../../src/exception/apikit-exception";

import {
    ErrorCategory,
} from "../../../src/errors/enum/ErrorCategory";

import {
    handleGlobalError,
} from "../../../src/errors/handler/error-handler";

vi.mock("../../../src/errors/handler/error-handler", () => ({
    handleGlobalError: vi.fn(),
}));


describe("apikitExceptionHandler", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });



    it("doit lever une erreur si l'erreur fournie n'est pas une ApikitException", () => {

        const error = new Error("Erreur externe");

        expect(() =>
            apikitExceptionHandler({
                error,
            })
        ).toThrow(error);

    });


    it("doit appeler onBusinessError pour une erreur BUSINESS", () => {

        const error = new ApikitException(
            "USER_NOT_FOUND",
            "Utilisateur introuvable",
            ErrorCategory.BUSINESS
        );

        const onBusinessError = vi.fn();

        apikitExceptionHandler({
            error,
            onBusinessError,
        });

        expect(onBusinessError).toHaveBeenCalledTimes(1);
        expect(onBusinessError).toHaveBeenCalledWith(error);

        expect(handleGlobalError).not.toHaveBeenCalled();

    });


    it("ne doit rien faire pour BUSINESS si aucun handler n'est fourni", () => {

        const error = new ApikitException(
            "BUSINESS_ERROR",
            "Erreur métier",
            ErrorCategory.BUSINESS
        );

        expect(() =>
            apikitExceptionHandler({
                error,
            })
        ).not.toThrow();

        expect(handleGlobalError).not.toHaveBeenCalled();

    });


    it("doit appeler onAuthorizationError pour une erreur AUTHORIZATION", () => {

        const error = new ApikitException(
            "FORBIDDEN",
            "Accès interdit",
            ErrorCategory.AUTHORIZATION
        );

        const onAuthorizationError = vi.fn();

        apikitExceptionHandler({
            error,
            onAuthorizationError,
        });

        expect(onAuthorizationError).toHaveBeenCalledTimes(1);
        expect(onAuthorizationError).toHaveBeenCalledWith(error);

    });


    it("doit appeler handleGlobalError pour AUTHORIZATION", () => {

        const error = new ApikitException(
            "FORBIDDEN",
            "Accès interdit",
            ErrorCategory.AUTHORIZATION
        );

        apikitExceptionHandler({
            error,
        });

        expect(handleGlobalError).toHaveBeenCalledTimes(1);
        expect(handleGlobalError).toHaveBeenCalledWith(error);

    });


    it("doit appeler handleGlobalError pour AUTHENTICATION", () => {

        const error = new ApikitException(
            "TOKEN_EXPIRED",
            "Token expiré",
            ErrorCategory.AUTHENTICATION
        );

        apikitExceptionHandler({
            error,
        });

        expect(handleGlobalError).toHaveBeenCalledTimes(1);
        expect(handleGlobalError).toHaveBeenCalledWith(error);

    });


    it("ne doit pas appeler handleGlobalError pour BUSINESS", () => {

        const error = new ApikitException(
            "BUSINESS_ERROR",
            "Erreur métier",
            ErrorCategory.BUSINESS
        );

        apikitExceptionHandler({
            error,
        });

        expect(handleGlobalError).not.toHaveBeenCalled();

    });


    it("ne doit rien faire pour une erreur TECHNICAL", () => {

        const error = new ApikitException(
            "TECHNICAL_ERROR",
            "Erreur technique",
            ErrorCategory.TECHNICAL
        );

        apikitExceptionHandler({
            error,
        });

        expect(handleGlobalError).not.toHaveBeenCalled();

    });


    it("doit repropager une erreur lancée par le callback métier", () => {

        const error = new ApikitException(
            "BUSINESS_ERROR",
            "Erreur métier",
            ErrorCategory.BUSINESS
        );

        const callbackError = new Error("Erreur callback");

        const onBusinessError = vi.fn(() => {
            throw callbackError;
        });

        expect(() =>
            apikitExceptionHandler({
                error,
                onBusinessError,
            })
        ).toThrow(callbackError);

    });


    it("doit repropager une erreur lancée par le callback d'autorisation", () => {

        const error = new ApikitException(
            "FORBIDDEN",
            "Accès interdit",
            ErrorCategory.AUTHORIZATION
        );

        const callbackError = new Error("Erreur callback");

        const onAuthorizationError = vi.fn(() => {
            throw callbackError;
        });

        expect(() =>
            apikitExceptionHandler({
                error,
                onAuthorizationError,
            })
        ).toThrow(callbackError);

    });

});