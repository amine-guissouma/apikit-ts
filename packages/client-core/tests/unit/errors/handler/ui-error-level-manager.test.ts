import { beforeEach, describe, expect, it } from "vitest";

import { UIErrorLevelRegistry } from "../../../../src/errors/handler/ui-error-level-manager";
import { ErrorLevelVisibility } from "../../../../src/errors/enum/ErrorLevelVisibility";

describe("UIErrorLevelRegistry", () => {

    beforeEach(() => {
        UIErrorLevelRegistry.set(ErrorLevelVisibility.PROD);
    });

    it("doit avoir PROD comme niveau par défaut", () => {
        expect(UIErrorLevelRegistry.get()).toBe(
            ErrorLevelVisibility.PROD
        );
    });

    it("doit enregistrer le niveau DEV", () => {
        UIErrorLevelRegistry.set(ErrorLevelVisibility.DEV);

        expect(UIErrorLevelRegistry.get()).toBe(
            ErrorLevelVisibility.DEV
        );
    });

    it("doit enregistrer le niveau INTEG", () => {
        UIErrorLevelRegistry.set(ErrorLevelVisibility.INTEG);

        expect(UIErrorLevelRegistry.get()).toBe(
            ErrorLevelVisibility.INTEG
        );
    });

    it("doit enregistrer le niveau QUAL", () => {
        UIErrorLevelRegistry.set(ErrorLevelVisibility.QUAL);

        expect(UIErrorLevelRegistry.get()).toBe(
            ErrorLevelVisibility.QUAL
        );
    });

    it("doit enregistrer le niveau PROD", () => {
        UIErrorLevelRegistry.set(ErrorLevelVisibility.PROD);

        expect(UIErrorLevelRegistry.get()).toBe(
            ErrorLevelVisibility.PROD
        );
    });

    it("doit remplacer le niveau précédent", () => {
        UIErrorLevelRegistry.set(ErrorLevelVisibility.DEV);
        UIErrorLevelRegistry.set(ErrorLevelVisibility.QUAL);

        expect(UIErrorLevelRegistry.get()).toBe(
            ErrorLevelVisibility.QUAL
        );
    });
});