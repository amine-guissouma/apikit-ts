import { describe, expect, it } from "vitest";

import { apikitUnwrapper } from "../../../../src/contracts/response/apikit-unwrapper";
import { ApikitException } from "../../../../src/exception/apikit-exception";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";

import { BusinessErrorRegistry } from "../../../../src/errors/mapping/business-error-codes";
import { beforeEach } from "vitest";

describe("apikitUnwrapper", () => {
    beforeEach(() => {
        BusinessErrorRegistry.reset();
    });
    it("doit retourner data pour une réponse valide", () => {

        const response = {
            success: true,
            message: "OK",
            data: {
                id: 123,
                name: "Amino",
            },
        };

        const result = apikitUnwrapper(response);

        expect(result).toEqual({
            id: 123,
            name: "Amino",
        });
    });


    it("doit accepter data avec une valeur primitive", () => {

        const response = {
            success: true,
            message: "OK",
            data: "hello",
        };

        const result = apikitUnwrapper<string>(response);

        expect(result).toBe("hello");
    });


    it("doit lever une ApikitException si le contrat est invalide", () => {

        const response = {
            success: true,
            data: {},
        };

        expect(() => {
            apikitUnwrapper(response);
        }).toThrow(ApikitException);
    });


    it("doit lever une erreur CONTRACT pour un contrat invalide", () => {

        const response = {
            success: true,
            data: {},
        };

        expect(() => {
            apikitUnwrapper(response);
        }).toThrow(
            expect.objectContaining({
                code: "APIKIT_RESPONSE_INVALID",
                errorType: ErrorCategory.CONTRACT,
            })
        );
    });


    it("doit lever une exception pour une réponse API en erreur", () => {

        const response = {
            success: false,
            message: "Utilisateur introuvable",
            error: {
                code: "USER_NOT_FOUND",
                message: "Utilisateur introuvable",
            },
        };

        expect(() => {
            apikitUnwrapper(response);
        }).toThrow(ApikitException);
    });



    it("doit détecter une réponse d'erreur sans objet error", () => {

        const response = {
            success: false,
            message: "Erreur serveur",
        };

        expect(() => {
            apikitUnwrapper(response);
        }).toThrow(
            expect.objectContaining({
                code: "APIKIT_ERROR_MALFORMED",
                errorType: ErrorCategory.CONTRACT,
            })
        );
    });

    it("doit détecter une réponse de succès sans data", () => {

        const response = {
            success: true,
            message: "OK",
        };

        expect(() => {
            apikitUnwrapper(response);
        }).toThrow(
            expect.objectContaining({
                code: "APIKIT_DATA_MISSING",
                errorType: ErrorCategory.CONTRACT,
            })
        );
    });
    it("doit classifier une erreur métier configurée", () => {

        BusinessErrorRegistry.set({
            USER_NOT_FOUND: ErrorCategory.BUSINESS,
        });

        const response = {
            success: false,
            message: "Erreur",
            error: {
                code: "USER_NOT_FOUND",
                message: "Utilisateur introuvable",
            },
        };

        expect(() => {
            apikitUnwrapper(response);
        }).toThrow(
            expect.objectContaining({
                code: "USER_NOT_FOUND",
                errorType: ErrorCategory.BUSINESS,
            })
        );
    });
});
