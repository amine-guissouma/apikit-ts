import { beforeEach, describe, expect, it } from "vitest";

import { BusinessErrorRegistry } from "../../../../src/errors/mapping/business-error-codes";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";


describe("BusinessErrorRegistry", () => {

    beforeEach(() => {
        BusinessErrorRegistry.reset();
    });


    it("doit être vide après réinitialisation", () => {

        expect(BusinessErrorRegistry.get()).toEqual({});
    });


    it("doit enregistrer un code métier", () => {

        BusinessErrorRegistry.set({
            USER_NOT_FOUND: ErrorCategory.BUSINESS,
        });

        expect(BusinessErrorRegistry.has("USER_NOT_FOUND")).toBe(true);

        expect(
            BusinessErrorRegistry.getCategory("USER_NOT_FOUND")
        ).toBe(ErrorCategory.BUSINESS);
    });


    it("doit enregistrer plusieurs codes", () => {

        BusinessErrorRegistry.set({
            USER_NOT_FOUND: ErrorCategory.BUSINESS,
            INVALID_TOKEN: ErrorCategory.AUTHENTICATION,
            ACCESS_DENIED: ErrorCategory.AUTHORIZATION,
        });

        expect(BusinessErrorRegistry.get()).toEqual({
            USER_NOT_FOUND: ErrorCategory.BUSINESS,
            INVALID_TOKEN: ErrorCategory.AUTHENTICATION,
            ACCESS_DENIED: ErrorCategory.AUTHORIZATION,
        });
    });


    it("doit retourner false pour un code inconnu", () => {

        expect(
            BusinessErrorRegistry.has("UNKNOWN_ERROR")
        ).toBe(false);
    });


    it("doit retourner undefined pour un code inconnu", () => {

        expect(
            BusinessErrorRegistry.getCategory("UNKNOWN_ERROR")
        ).toBeUndefined();
    });


    it("doit fusionner les nouvelles configurations", () => {

        BusinessErrorRegistry.set({
            ERROR_ONE: ErrorCategory.BUSINESS,
        });

        BusinessErrorRegistry.set({
            ERROR_TWO: ErrorCategory.AUTHORIZATION,
        });

        expect(BusinessErrorRegistry.get()).toEqual({
            ERROR_ONE: ErrorCategory.BUSINESS,
            ERROR_TWO: ErrorCategory.AUTHORIZATION,
        });
    });


});