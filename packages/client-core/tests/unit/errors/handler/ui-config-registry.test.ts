import { beforeEach, describe, expect, it, vi } from "vitest";

import {
    UIErrorConfigRegistry,
} from "../../../../src/errors/handler/ui-config-registry";

import {
    ErrorLevelVisibility,
} from "../../../../src/errors/enum/ErrorLevelVisibility";

import {
    ApikitException,
} from "../../../../src/exception/apikit-exception";

import {
    ErrorCategory,
} from "../../../../src/errors/enum/ErrorCategory";


describe("UIErrorConfigRegistry", () => {

    const error = new ApikitException(
        "TEST_ERROR",
        "Erreur de test",
        ErrorCategory.TECHNICAL
    );

    beforeEach(() => {
        UIErrorConfigRegistry.set({});
    });


    it("doit retourner undefined lorsqu'aucune configuration n'existe", () => {

        expect(
            UIErrorConfigRegistry.get(ErrorLevelVisibility.DEV)
        ).toBeUndefined();

    });


    it("doit retourner le handler DEV", () => {

        const handler = vi.fn();

        UIErrorConfigRegistry.set({
            dev: handler,
        });

        expect(
            UIErrorConfigRegistry.get(ErrorLevelVisibility.DEV)
        ).toBe(handler);

    });


    it("doit retourner le handler INTEG", () => {

        const handler = vi.fn();

        UIErrorConfigRegistry.set({
            integ: handler,
        });

        expect(
            UIErrorConfigRegistry.get(ErrorLevelVisibility.INTEG)
        ).toBe(handler);

    });


    it("doit retourner le handler QUAL", () => {

        const handler = vi.fn();

        UIErrorConfigRegistry.set({
            qual: handler,
        });

        expect(
            UIErrorConfigRegistry.get(ErrorLevelVisibility.QUAL)
        ).toBe(handler);

    });


    it("doit retourner le handler PROD", () => {

        const handler = vi.fn();

        UIErrorConfigRegistry.set({
            prod: handler,
        });

        expect(
            UIErrorConfigRegistry.get(ErrorLevelVisibility.PROD)
        ).toBe(handler);

    });


    it("doit retourner undefined lorsqu'un niveau n'est pas configuré", () => {

        const devHandler = vi.fn();

        UIErrorConfigRegistry.set({
            dev: devHandler,
        });

        expect(
            UIErrorConfigRegistry.get(ErrorLevelVisibility.PROD)
        ).toBeUndefined();

    });


    it("doit pouvoir exécuter le handler récupéré", () => {

        const handler = vi.fn();

        UIErrorConfigRegistry.set({
            prod: handler,
        });

        const retrievedHandler =
            UIErrorConfigRegistry.get(ErrorLevelVisibility.PROD);

        retrievedHandler?.(error);

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(error);

    });


    it("doit remplacer l'ancienne configuration", () => {

        const firstHandler = vi.fn();
        const secondHandler = vi.fn();

        UIErrorConfigRegistry.set({
            prod: firstHandler,
        });

        UIErrorConfigRegistry.set({
            prod: secondHandler,
        });

        expect(
            UIErrorConfigRegistry.get(ErrorLevelVisibility.PROD)
        ).toBe(secondHandler);

    });

});