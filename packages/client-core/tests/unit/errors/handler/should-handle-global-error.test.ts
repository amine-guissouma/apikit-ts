import { describe, expect, it } from "vitest";

import { shouldHandleGlobalError } from "../../../../src/errors/handler/should-handle-global-error";
import { ApikitException } from "../../../../src/exception/apikit-exception";
import {ErrorCategory} from "../../../../src/errors/enum/ErrorCategory";

describe("shouldHandleGlobalError", () => {

    it("doit retourner false pour une erreur BUSINESS", () => {
        const error = new ApikitException(
            "BUSINESS_ERROR",
            "Erreur métier",
            ErrorCategory.BUSINESS
        );

        expect(shouldHandleGlobalError(error)).toBe(false);
    });


    it("doit retourner false pour une erreur AUTHENTICATION", () => {
        const error = new ApikitException(
            "AUTH_ERROR",
            "Authentification nécessaire",
            ErrorCategory.AUTHENTICATION
        );

        expect(shouldHandleGlobalError(error)).toBe(false);
    });


    it("doit retourner false pour une erreur AUTHORIZATION", () => {
        const error = new ApikitException(
            "AUTHORIZATION_ERROR",
            "Accès interdit",
            ErrorCategory.AUTHORIZATION
        );

        expect(shouldHandleGlobalError(error)).toBe(false);
    });


    it("doit retourner true pour une erreur TECHNICAL", () => {
        const error = new ApikitException(
            "TECHNICAL_ERROR",
            "Erreur technique",
            ErrorCategory.TECHNICAL
        );

        expect(shouldHandleGlobalError(error)).toBe(true);
    });


    it("doit retourner true pour une erreur SERVER", () => {
        const error = new ApikitException(
            "SERVER_ERROR",
            "Erreur serveur",
            ErrorCategory.SERVER
        );

        expect(shouldHandleGlobalError(error)).toBe(true);
    });

    it("doit retourner true pour une erreur CONTRACT", () => {
        const error = new ApikitException(
            "CONTRACT",
            "Erreur de contrat",
            ErrorCategory.CONTRACT
        );

        expect(shouldHandleGlobalError(error)).toBe(true);
    });

    it("doit retourner true pour une erreur SERVER_UNEXPECTED", () => {
        const error = new ApikitException(
            "SERVER_UNEXPECTED",
            "Erreur serveur inattendue",
            ErrorCategory.SERVER_UNEXPECTED
        );

        expect(shouldHandleGlobalError(error)).toBe(true);
    });

    it("doit retourner true pour une erreur SERVER_UNAVAILABLE", () => {
        const error = new ApikitException(
            "SERVER_UNAVAILABLE",
            "Serveur indisponible",
            ErrorCategory.SERVER_UNAVAILABLE
        );

        expect(shouldHandleGlobalError(error)).toBe(true);
    });
    it("doit retourner true pour une erreur UNEXPECTED", () => {
        const error = new ApikitException(
            "UNEXPECTED",
            "Erreur inattendue",
            ErrorCategory.UNEXPECTED
        );

        expect(shouldHandleGlobalError(error)).toBe(true);
    });


    it("doit retourner true pour une erreur CANCELLED", () => {
        const error = new ApikitException(
            "CANCELLED",
            "Requête annulée",
            ErrorCategory.CANCELLED
        );

        expect(shouldHandleGlobalError(error)).toBe(true);
    });
});