import { describe, expect, it } from "vitest";

import { HttpStatusMapper } from "../../../../src/http/status/http-status-mapper";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";


describe("HttpStatusMapper", () => {

    it("doit mapper HTTP 401 vers AUTHENTICATION", () => {

        expect(HttpStatusMapper[401]).toEqual({
            code: "APIKIT_HTTP_401_AUTHENTICATION_ERROR",
            message: "Token expiré.",
            category: ErrorCategory.AUTHENTICATION,
        });

    });


    it("doit mapper HTTP 403 vers AUTHORIZATION", () => {

        expect(HttpStatusMapper[403]).toEqual({
            code: "APIKIT_HTTP_403_AUTHORIZATION_ERROR",
            message: "Accès interdit.",
            category: ErrorCategory.AUTHORIZATION,
        });

    });


    it("doit mapper HTTP 500 vers SERVER_UNEXPECTED", () => {

        expect(HttpStatusMapper[500]).toEqual({
            code: "APIKIT_HTTP_500_UNKNOWN_SERVER_ERROR",
            message: "Une erreur inattendue est survenue.",
            category: ErrorCategory.SERVER_UNEXPECTED,
        });

    });


    it("doit mapper HTTP 502 vers SERVER_UNAVAILABLE", () => {

        expect(HttpStatusMapper[502]).toEqual({
            code: "APIKIT_HTTP_502_PROXY_GATEWAY_ERROR",
            message: "Infrastructure ou communication.",
            category: ErrorCategory.SERVER_UNAVAILABLE,
        });

    });


    it("doit mapper HTTP 503 vers SERVER_UNAVAILABLE", () => {

        expect(HttpStatusMapper[503]).toEqual({
            code: "APIKIT_HTTP_503_SERVICE_UNAVAILABLE",
            message: "Service indisponible.",
            category: ErrorCategory.SERVER_UNAVAILABLE,
        });

    });


    it("doit mapper HTTP 504 vers SERVER_UNAVAILABLE", () => {

        expect(HttpStatusMapper[504]).toEqual({
            code: "APIKIT_HTTP_504_TIMEOUT",
            message: "Infrastructure ou communication.",
            category: ErrorCategory.SERVER_UNAVAILABLE,
        });

    });


    it("doit contenir exactement les statuts HTTP supportés", () => {

        expect(Object.keys(HttpStatusMapper))
            .toEqual([
                "401",
                "403",
                "500",
                "502",
                "503",
                "504",
            ]);

    });


    it("ne doit pas contenir de mapping pour un statut HTTP inconnu", () => {

        expect(HttpStatusMapper[400]).toBeUndefined();
        expect(HttpStatusMapper[404]).toBeUndefined();
        expect(HttpStatusMapper[429]).toBeUndefined();

    });

});