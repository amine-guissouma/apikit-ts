import { describe, it, expect } from "vitest";

import { ApikitException } from "../../../src/exception/apikit-exception";
import { ErrorCategory } from "../../../src/errors/enum/ErrorCategory";


describe("ApikitException", () => {

    it("doit créer une exception avec les propriétés fournies", () => {

        const error = new ApikitException(
            "USER_NOT_FOUND",
            "Utilisateur introuvable",
            ErrorCategory.BUSINESS,
            {
                userId: 123,
            }
        );

        expect(error.code).toBe("USER_NOT_FOUND");
        expect(error.message).toBe("Utilisateur introuvable");
        expect(error.errorType).toBe(ErrorCategory.BUSINESS);
        expect(error.details).toEqual({
            userId: 123,
        });
    });


    it("doit être une instance de Error", () => {

        const error = new ApikitException(
            "TEST_ERROR",
            "Erreur de test",
            ErrorCategory.TECHNICAL
        );

        expect(error).toBeInstanceOf(Error);
    });


    it("doit être une instance de ApikitException", () => {

        const error = new ApikitException(
            "TEST_ERROR",
            "Erreur de test",
            ErrorCategory.TECHNICAL
        );

        expect(error).toBeInstanceOf(ApikitException);
    });


    it("doit définir le nom de l'erreur", () => {

        const error = new ApikitException(
            "TEST_ERROR",
            "Erreur de test",
            ErrorCategory.TECHNICAL
        );

        expect(error.name).toBe("ApiException");
    });


    it("doit accepter details comme propriété optionnelle", () => {

        const error = new ApikitException(
            "TEST_ERROR",
            "Erreur de test",
            ErrorCategory.CONTRACT
        );

        expect(error.details).toBeUndefined();
    });

});