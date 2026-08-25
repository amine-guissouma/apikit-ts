import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    configureApikit,
} from "../../../src/config/create-config";

import {
    UIErrorLevelRegistry,
} from "../../../src/errors/handler/ui-error-level-manager";

import {
    UIErrorConfigRegistry,
} from "../../../src/errors/handler/ui-config-registry";

import {
    BusinessErrorRegistry,
} from "../../../src/errors/mapping/business-error-codes";

import {
    ApikitHookRegistry,
} from "../../../src/config/apikit-hook-registry";

import {
    ErrorLevelVisibility,
} from "../../../src/errors/enum/ErrorLevelVisibility";

import {
    ErrorCategory,
} from "../../../src/errors/enum/ErrorCategory";


describe("configureApikit", () => {

    beforeEach(() => {

        UIErrorLevelRegistry.set(
            ErrorLevelVisibility.PROD
        );

        UIErrorConfigRegistry.set({});

        BusinessErrorRegistry.set({
            TEST_RESET: ErrorCategory.BUSINESS,
        });

        ApikitHookRegistry.set({});

    });


    it("doit configurer le niveau de visibilité", () => {

        configureApikit({
            visibility: ErrorLevelVisibility.DEV,
        });

        expect(
            UIErrorLevelRegistry.get()
        ).toBe(ErrorLevelVisibility.DEV);

    });


    it("doit configurer la configuration UI", () => {

        const handler = vi.fn();

        configureApikit({
            ui: {
                dev: handler,
            },
        });

        expect(
            UIErrorConfigRegistry.get(
                ErrorLevelVisibility.DEV
            )
        ).toBe(handler);

    });


    it("doit configurer les codes métier", () => {

        configureApikit({
            businessErrors: {
                USER_NOT_FOUND: ErrorCategory.BUSINESS,
                TOKEN_EXPIRED: ErrorCategory.AUTHENTICATION,
            },
        });

        expect(
            BusinessErrorRegistry.getCategory("USER_NOT_FOUND")
        ).toBe(ErrorCategory.BUSINESS);

        expect(
            BusinessErrorRegistry.getCategory("TOKEN_EXPIRED")
        ).toBe(ErrorCategory.AUTHENTICATION);

    });


    it("doit configurer les hooks", () => {

        const beforeRequest = vi.fn();
        const afterResponse = vi.fn();
        const onError = vi.fn();

        configureApikit({
            hooks: {
                beforeRequest: [beforeRequest],
                afterResponse: [afterResponse],
                onError: [onError],
            },
        });

        expect(
            ApikitHookRegistry.get().beforeRequest
        ).toEqual([beforeRequest]);

        expect(
            ApikitHookRegistry.get().afterResponse
        ).toEqual([afterResponse]);

        expect(
            ApikitHookRegistry.get().onError
        ).toEqual([onError]);

    });


    it("doit configurer toutes les options simultanément", () => {

        const uiHandler = vi.fn();
        const beforeRequest = vi.fn();
        const afterResponse = vi.fn();
        const onError = vi.fn();

        configureApikit({

            visibility: ErrorLevelVisibility.INTEG,

            ui: {
                integ: uiHandler,
            },

            businessErrors: {
                INVALID_CREDENTIALS:
                ErrorCategory.AUTHENTICATION,
            },

            hooks: {
                beforeRequest: [beforeRequest],
                afterResponse: [afterResponse],
                onError: [onError],
            },

        });


        expect(
            UIErrorLevelRegistry.get()
        ).toBe(ErrorLevelVisibility.INTEG);


        expect(
            UIErrorConfigRegistry.get(
                ErrorLevelVisibility.INTEG
            )
        ).toBe(uiHandler);


        expect(
            BusinessErrorRegistry.getCategory(
                "INVALID_CREDENTIALS"
            )
        ).toBe(ErrorCategory.AUTHENTICATION);


        expect(
            ApikitHookRegistry.get().beforeRequest
        ).toEqual([beforeRequest]);


        expect(
            ApikitHookRegistry.get().afterResponse
        ).toEqual([afterResponse]);


        expect(
            ApikitHookRegistry.get().onError
        ).toEqual([onError]);

    });


    it("ne doit rien modifier lorsqu'une configuration vide est fournie", () => {

        UIErrorLevelRegistry.set(
            ErrorLevelVisibility.QUAL
        );

        configureApikit({});

        expect(
            UIErrorLevelRegistry.get()
        ).toBe(ErrorLevelVisibility.QUAL);

    });


    it("doit conserver les anciens codes métier lors d'une nouvelle configuration", () => {

        configureApikit({
            businessErrors: {
                FIRST_ERROR: ErrorCategory.BUSINESS,
            },
        });

        configureApikit({
            businessErrors: {
                SECOND_ERROR: ErrorCategory.AUTHORIZATION,
            },
        });

        expect(
            BusinessErrorRegistry.getCategory("FIRST_ERROR")
        ).toBe(ErrorCategory.BUSINESS);

        expect(
            BusinessErrorRegistry.getCategory("SECOND_ERROR")
        ).toBe(ErrorCategory.AUTHORIZATION);

    });

});