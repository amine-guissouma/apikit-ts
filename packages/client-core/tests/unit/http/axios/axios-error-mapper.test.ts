import { describe, expect, it } from "vitest";

import { AxiosErrorMapper } from "../../../../src/http/axios/axios-error-mapper";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";


describe("AxiosErrorMapper", () => {

    it("doit mapper ERR_NETWORK", () => {

        expect(AxiosErrorMapper.ERR_NETWORK).toEqual({
            code: "APIKIT_NETWORK_ERROR",
            message: "Impossible de joindre le serveur.",
            category: ErrorCategory.TECHNICAL,
        });

    });


    it("doit mapper ECONNABORTED", () => {

        expect(AxiosErrorMapper.ECONNABORTED).toEqual({
            code: "APIKIT_AXIOS_NETWORK_TIMEOUT",
            message: "Le délai d'attente du serveur est dépassé.",
            category: ErrorCategory.TECHNICAL,
        });

    });


    it("doit mapper ERR_CANCELED", () => {

        expect(AxiosErrorMapper.ERR_CANCELED).toEqual({
            code: "APIKIT_AXIOS_REQUEST_CANCELED",
            message: "La requête a été annulée.",
            category: ErrorCategory.CANCELLED,
        });

    });


    it("doit mapper ERR_INVALID_URL", () => {

        expect(AxiosErrorMapper.ERR_INVALID_URL).toEqual({
            code: "APIKIT_AXIOS_INVALID_URL",
            message: "URL du serveur invalide.",
            category: ErrorCategory.TECHNICAL,
        });

    });


    it("doit mapper ERR_BAD_REQUEST", () => {

        expect(AxiosErrorMapper.ERR_BAD_REQUEST).toEqual({
            code: "APIKIT_AXIOS_BAD_REQUEST",
            message: "Requête HTTP invalide.",
            category: ErrorCategory.TECHNICAL,
        });

    });


    it("doit mapper ERR_BAD_RESPONSE", () => {

        expect(AxiosErrorMapper.ERR_BAD_RESPONSE).toEqual({
            code: "APIKIT_AXIOS_BAD_RESPONSE",
            message: "Réponse HTTP invalide.",
            category: ErrorCategory.TECHNICAL,
        });

    });


    it("doit mapper ERR_FR_TOO_MANY_REDIRECTS", () => {

        expect(AxiosErrorMapper.ERR_FR_TOO_MANY_REDIRECTS).toEqual({
            code: "APIKIT_AXIOS_TOO_MANY_REDIRECTS",
            message: "Trop de redirections.",
            category: ErrorCategory.TECHNICAL,
        });

    });


    it("doit mapper ERR_NOT_SUPPORT", () => {

        expect(AxiosErrorMapper.ERR_NOT_SUPPORT).toEqual({
            code: "APIKIT_AXIOS_NOT_SUPPORTED",
            message: "Fonction HTTP non supportée.",
            category: ErrorCategory.TECHNICAL,
        });

    });


    it("doit mapper ERR_DEPRECATED", () => {

        expect(AxiosErrorMapper.ERR_DEPRECATED).toEqual({
            code: "APIKIT_AXIOS_DEPRECATED",
            message: "Fonction Axios obsolète.",
            category: ErrorCategory.TECHNICAL,
        });

    });


    it("doit contenir exactement les codes Axios supportés", () => {

        expect(Object.keys(AxiosErrorMapper)).toEqual([
            "ERR_NETWORK",
            "ECONNREFUSED",
            "ECONNABORTED",
            "ERR_CANCELED",
            "ERR_INVALID_URL",
            "ERR_BAD_REQUEST",
            "ERR_BAD_RESPONSE",
            "ERR_FR_TOO_MANY_REDIRECTS",
            "ERR_NOT_SUPPORT",
            "ERR_DEPRECATED",
        ]);

    });

});