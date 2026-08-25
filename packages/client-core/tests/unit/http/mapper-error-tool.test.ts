import { describe, it, expect } from "vitest";

import {
    getMappedError,
    ErrorDefinition,
} from "../../../src/http/mapper-error-tool";

import { ErrorCategory } from "../../../src/errors/enum/ErrorCategory";


describe("getMappedError", () => {

    it("doit retourner l'erreur correspondant à une clé existante", () => {

        const map: Record<string, ErrorDefinition> = {
            ERROR_001: {
                code: "ERROR_001",
                message: "Erreur test",
                category: ErrorCategory.BUSINESS,
            },
        };


        const result = getMappedError(map, "ERROR_001");

        expect(result).toEqual({
            code: "ERROR_001",
            message: "Erreur test",
            category: ErrorCategory.BUSINESS,
        });
    });


    it("doit retourner l'erreur par défaut si la clé n'existe pas", () => {

        const map: Record<string, ErrorDefinition> = {
            ERROR_001: {
                code: "ERROR_001",
                message: "Erreur test",
                category: ErrorCategory.BUSINESS,
            },
        };

        const defaultError: ErrorDefinition = {
            code: "DEFAULT_ERROR",
            message: "Erreur par défaut",
            category: ErrorCategory.UNEXPECTED,
        };

        const result = getMappedError(
            map,
            "ERROR_UNKNOWN",
            defaultError
        );

        expect(result).toEqual(defaultError);
    });


    it("doit retourner l'erreur par défaut si la clé est undefined", () => {

        const map: Record<string, ErrorDefinition> = {};

        const defaultError: ErrorDefinition = {
            code: "DEFAULT_ERROR",
            message: "Erreur par défaut",
            category: ErrorCategory.UNEXPECTED,
        };

        const result = getMappedError(
            map,
            undefined,
            defaultError
        );

        expect(result).toEqual(defaultError);
    });


    it("doit retourner l'erreur par défaut si la clé est null", () => {

        const map: Record<string, ErrorDefinition> = {};

        const defaultError: ErrorDefinition = {
            code: "DEFAULT_ERROR",
            message: "Erreur par défaut",
            category: ErrorCategory.UNEXPECTED,
        };

        const result = getMappedError(
            map,
            undefined,
            defaultError
        );

        expect(result).toEqual(defaultError);
    });

});