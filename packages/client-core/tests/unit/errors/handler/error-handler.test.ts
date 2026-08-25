import { beforeEach, describe, expect, it, vi } from "vitest";

import { handleGlobalError } from "../../../../src/errors/handler/error-handler";
import { ApikitException } from "../../../../src/exception/apikit-exception";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";
import { ErrorLevelVisibility } from "../../../../src/errors/enum/ErrorLevelVisibility";
import { UIErrorConfigRegistry } from "../../../../src/errors/handler/ui-config-registry";
import { UIErrorLevelRegistry } from "../../../../src/errors/handler/ui-error-level-manager";


describe("handleGlobalError", () => {

    const error = new ApikitException(
        "TEST_ERROR",
        "Erreur de test",
        ErrorCategory.TECHNICAL,
        {
            foo: "bar",
        }
    );

    beforeEach(() => {
        vi.restoreAllMocks();

        UIErrorLevelRegistry.set(ErrorLevelVisibility.PROD);

        UIErrorConfigRegistry.set({});
    });


    it("doit appeler le handler personnalisé lorsqu'il existe", () => {

        const customHandler = vi.fn();

        UIErrorLevelRegistry.set(ErrorLevelVisibility.PROD);

        UIErrorConfigRegistry.set({
            prod: customHandler,
        });

        handleGlobalError(error);

        expect(customHandler).toHaveBeenCalledTimes(1);
        expect(customHandler).toHaveBeenCalledWith(error);
    });


    it("ne doit pas exécuter le comportement par défaut lorsqu'un handler personnalisé existe", () => {

        const customHandler = vi.fn();
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        UIErrorLevelRegistry.set(ErrorLevelVisibility.PROD);

        UIErrorConfigRegistry.set({
            prod: customHandler,
        });

        handleGlobalError(error);

        expect(customHandler).toHaveBeenCalledWith(error);
        expect(consoleError).not.toHaveBeenCalled();
    });


    it("doit afficher les détails en DEV", () => {

        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const consoleLog = vi
            .spyOn(console, "log")
            .mockImplementation(() => {});

        UIErrorLevelRegistry.set(ErrorLevelVisibility.DEV);

        handleGlobalError(error);

        expect(consoleLog).toHaveBeenCalled();
        expect(consoleError).toHaveBeenCalledWith(
            "[APIKIT GLOBAL ERROR]",
            error.code,
            error.message
        );

        expect(consoleError).toHaveBeenCalledWith(error.details);
    });


    it("doit afficher les détails en INTEG", () => {

        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        UIErrorLevelRegistry.set(ErrorLevelVisibility.INTEG);

        handleGlobalError(error);

        expect(consoleError).toHaveBeenCalledWith(
            "[APIKIT GLOBAL ERROR]",
            error.code,
            error.message
        );

        expect(consoleError).toHaveBeenCalledWith(error.details);
    });


    it("ne doit pas afficher les détails en QUAL", () => {

        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        UIErrorLevelRegistry.set(ErrorLevelVisibility.QUAL);

        handleGlobalError(error);

        expect(consoleError).toHaveBeenCalledWith(
            "[APIKIT GLOBAL ERROR]",
            error.code,
            error.message
        );

        expect(consoleError).not.toHaveBeenCalledWith(error.details);
    });


    it("ne doit pas afficher les détails en PROD", () => {

        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        UIErrorLevelRegistry.set(ErrorLevelVisibility.PROD);

        handleGlobalError(error);

        expect(consoleError).toHaveBeenCalledWith(
            "[APIKIT GLOBAL ERROR]",
            error.code,
            error.message
        );

        expect(consoleError).not.toHaveBeenCalledWith(error.details);
    });


    it("doit fonctionner en DEV sans détails", () => {

        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const errorWithoutDetails = new ApikitException(
            "TEST_ERROR",
            "Erreur de test",
            ErrorCategory.TECHNICAL
        );

        UIErrorLevelRegistry.set(ErrorLevelVisibility.DEV);

        handleGlobalError(errorWithoutDetails);

        expect(consoleError).toHaveBeenCalledWith(
            "[APIKIT GLOBAL ERROR]",
            errorWithoutDetails.code,
            errorWithoutDetails.message
        );
    });


    it("doit fonctionner en INTEG sans détails", () => {

        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});

        const errorWithoutDetails = new ApikitException(
            "TEST_ERROR",
            "Erreur de test",
            ErrorCategory.TECHNICAL
        );

        UIErrorLevelRegistry.set(ErrorLevelVisibility.INTEG);

        handleGlobalError(errorWithoutDetails);

        expect(consoleError).toHaveBeenCalledWith(
            "[APIKIT GLOBAL ERROR]",
            errorWithoutDetails.code,
            errorWithoutDetails.message
        );

    });
});