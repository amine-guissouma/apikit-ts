import { describe, expect, it } from "vitest";

import { shouldHandleGlobalError } from "../../../../src/errors/handler/should-handle-global-error";
import { ApikitException } from "../../../../src/exception/apikit-exception";
import { ErrorCategory } from "../../../../src/errors/enum/ErrorCategory";


const shouldHandleGlobalErrorCases: [boolean, ErrorCategory][] = [
    [false, ErrorCategory.BUSINESS],
    [false, ErrorCategory.AUTHENTICATION],
    [false, ErrorCategory.AUTHORIZATION],

    [true, ErrorCategory.TECHNICAL],
    [true, ErrorCategory.SERVER],
    [true, ErrorCategory.CONTRACT],
    [true, ErrorCategory.SERVER_UNEXPECTED],
    [true, ErrorCategory.SERVER_UNAVAILABLE],
    [true, ErrorCategory.UNEXPECTED],
    [true, ErrorCategory.CANCELLED],
];


describe("shouldHandleGlobalError", () => {

    describe("Verification de paramètres de test", () => {

            it("doit couvrir toutes les valeurs de ErrorCategory", () => {
                const expectedCategories = Object.values(ErrorCategory);

                const testedCategories = shouldHandleGlobalErrorCases.map(
                    ([, category]) => category
                );

                expect(testedCategories).toHaveLength(expectedCategories.length);
                expect(new Set(testedCategories).size).toBe(testedCategories.length);

                expect(testedCategories.sort()).toEqual(
                    expectedCategories.sort()
                );
            });
    });
    describe("comportement", () => {

        it.each(shouldHandleGlobalErrorCases)(
            "doit retourner [ $0 ] pour la catégorie [ $1 ]",
            (expected, category) => {

                const error = new ApikitException(
                    "ERROR_CODE",
                    "Error message",
                    category
                );

                expect(shouldHandleGlobalError(error)).toBe(expected);
            }
        );
    });

});