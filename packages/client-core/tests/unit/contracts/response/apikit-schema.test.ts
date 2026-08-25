import { describe, expect, it } from "vitest";

import {
    apikitErrorResponseSchema,
    apikitBaseResponseSchema,
} from "../../../../src/contracts/response/apikit-schema";


describe("apikitErrorResponseSchema", () => {

    it("doit accepter une erreur valide", () => {

        const result = apikitErrorResponseSchema.safeParse({
            code: "USER_NOT_FOUND",
            message: "Utilisateur introuvable",
        });

        expect(result.success).toBe(true);
    });


    it("doit accepter details", () => {

        const result = apikitErrorResponseSchema.safeParse({
            code: "VALIDATION_ERROR",
            message: "Données invalides",
            details: {
                field: "email",
            },
        });

        expect(result.success).toBe(true);
    });


    it("doit refuser une erreur sans code", () => {

        const result = apikitErrorResponseSchema.safeParse({
            message: "Erreur",
        });

        expect(result.success).toBe(false);
    });


    it("doit refuser une erreur sans message", () => {

        const result = apikitErrorResponseSchema.safeParse({
            code: "ERROR",
        });

        expect(result.success).toBe(false);
    });

});


describe("apikitBaseResponseSchema", () => {

    it("doit accepter une réponse de succès", () => {

        const result = apikitBaseResponseSchema.safeParse({
            success: true,
            message: "OK",
            data: {
                id: 123,
                name: "Amino",
            },
        });

        expect(result.success).toBe(true);
    });


    it("doit accepter une réponse d'erreur", () => {

        const result = apikitBaseResponseSchema.safeParse({
            success: false,
            message: "Erreur",
            error: {
                code: "USER_NOT_FOUND",
                message: "Utilisateur introuvable",
            },
        });

        expect(result.success).toBe(true);
    });


    it("doit refuser une réponse sans success", () => {

        const result = apikitBaseResponseSchema.safeParse({
            message: "OK",
            data: {},
        });

        expect(result.success).toBe(false);
    });


    it("doit refuser une réponse sans message", () => {

        const result = apikitBaseResponseSchema.safeParse({
            success: true,
            data: {},
        });

        expect(result.success).toBe(false);
    });

});