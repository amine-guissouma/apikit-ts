import { describe, expect, it } from "vitest";

import { ApikitErrorDefinitions } from "../../../../src/errors/definitions/apikit-error-definitions";
import {
    expectedApikitErrorCodeCategory,
    expectedApikitErrorCodes,
} from "../../../fixture/expected-mappings";

import {
    errorDefinitionValidator,
    mapperKeysValidator,
    mapperCategoryValidator, apikitErrorCodeNamingValidator,
} from "../../../fixture/tools/mapper";


describe("ApikitErrorDefinitions", () => {

    describe("Keys", () => {

        it("doit contenir exactement les codes Apikit supportés", () => {
            mapperKeysValidator(
                ApikitErrorDefinitions,
                expectedApikitErrorCodes,
            );
        });

    });


    describe("Code naming", () => {

        it.each(expectedApikitErrorCodes)(
            "doit respecter le nommage du code Apikit [%s]",
            (code) => {
                apikitErrorCodeNamingValidator(ApikitErrorDefinitions[code].code, code,);
            }
        );

    });


    describe("Definition", () => {

        it("doit respecter la structure ErrorDefinition", () => {
            Object.values(ApikitErrorDefinitions).forEach((definition) => {
                errorDefinitionValidator(definition);
            });
        });

    });


    describe("Category", () => {

        it.each(expectedApikitErrorCodeCategory)(
            "doit associer le code Apikit [%s] à la catégorie [%s]",
            (code, category) => {
                mapperCategoryValidator(ApikitErrorDefinitions, code, category,);
            }
        );

    });

    describe("Key / Code", () => {
        it("doit avoir une clé identique au code de la définition", () => {
            Object.entries(ApikitErrorDefinitions).forEach(
                ([key, definition]) => {expect(definition.code).toBe(key);}
            );
        });

    });


});