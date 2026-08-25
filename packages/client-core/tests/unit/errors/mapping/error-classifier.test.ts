import { beforeEach, describe, expect, it } from "vitest";

import { errorClassifier } from "../../../../src/errors/mapping/error-classifier";
import { BusinessErrorRegistry } from "../../../../src/errors/mapping/business-error-codes";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";


describe("errorClassifier", () => {

    beforeEach(() => {
        BusinessErrorRegistry.reset();
    });


    it("doit retourner la catégorie configurée pour un code métier", () => {

        BusinessErrorRegistry.set({
            USER_NOT_FOUND: ErrorCategory.BUSINESS,
        });

        expect(
            errorClassifier("USER_NOT_FOUND")
        ).toBe(ErrorCategory.BUSINESS);
    });


    it("doit retourner AUTHENTICATION pour un code configuré ainsi", () => {

        BusinessErrorRegistry.set({
            TOKEN_EXPIRED: ErrorCategory.AUTHENTICATION,
        });

        expect(
            errorClassifier("TOKEN_EXPIRED")
        ).toBe(ErrorCategory.AUTHENTICATION);
    });


    it("doit retourner SERVER pour un code inconnu", () => {

        expect(
            errorClassifier("UNKNOWN_ERROR")
        ).toBe(ErrorCategory.SERVER);
    });


    it("doit retourner SERVER si le code est undefined", () => {

        expect(
            errorClassifier(undefined)
        ).toBe(ErrorCategory.SERVER);
    });


    it("doit retourner SERVER si le code est vide", () => {

        expect(
            errorClassifier("")
        ).toBe(ErrorCategory.SERVER);
    });

});