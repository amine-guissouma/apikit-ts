import { describe, expect, it } from "vitest";

import { apikitUnwrapper } from "../../../../src/contracts/response/apikit-unwrapper";
import { ApikitException } from "../../../../src/exception/apikit-exception";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";

import { BusinessErrorRegistry } from "../../../../src/errors/mapping/business-error-codes";
import { beforeEach } from "vitest";
import {ApikitErrorCode} from "../../../../src/errors/definitions/enum/apikit-error-code";

describe("apikitUnwrapper", () => {
    beforeEach(() => {
        BusinessErrorRegistry.reset();
    });
    describe("response valid", () => {
        it("doit retourner data pour une réponse valide", () => {

            const expected = {
                id: 123,
                name: "Amino",
            };

            const response = {
                success: true,
                message: "OK",
                data: expected,
            };


            const result = apikitUnwrapper(response);
            expect(result).toEqual(expected);
        });


        it("doit accepter data avec une valeur primitive", () => {

            const expected = "hello";

            const response = {
                success: true,
                message: "OK",
                data: expected,
            };

            const result = apikitUnwrapper<string>(response);

            expect(result).toBe(expected);
        });
    });


    describe("response error", () => {
        it("doit lever une ApikitException si le contrat est invalide", () => {

            const response = {
                success: true,
                data: {},
            };

            expect(() => {apikitUnwrapper(response);}).toThrow(ApikitException);
        });

        it("doit lever une erreur CONTRACT pour un contrat invalide", () => {

            const response = {success: true, data: {},};

            const expected = { code: ApikitErrorCode.APIKIT_RESPONSE_INVALID, errorType: ErrorCategory.CONTRACT,};
            expect(() => {apikitUnwrapper(response);}).toThrow(expect.objectContaining(expected));
        });

        it("doit détecter une réponse d'erreur sans objet error", () => {

            const response = {
                success: false,
                message: "Erreur serveur",
            };

            const expected = {code: ApikitErrorCode.APIKIT_ERROR_MALFORMED, errorType: ErrorCategory.CONTRACT};
            expect(() => {apikitUnwrapper(response)}).toThrow(expect.objectContaining(expected));
        });

        it("doit détecter une réponse de succès sans data", () => {

            const response = {success: true, message: "OK",};

            const expected = {code: ApikitErrorCode.APIKIT_DATA_MISSING, errorType: ErrorCategory.CONTRACT};


            expect(() => {apikitUnwrapper(response)}).toThrow(expect.objectContaining(expected));
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

            const expected = {code: "USER_NOT_FOUND", errorType: ErrorCategory.BUSINESS,};

            expect(() => {apikitUnwrapper(response)}).toThrow(expect.objectContaining(expected));
        });
    });

});
