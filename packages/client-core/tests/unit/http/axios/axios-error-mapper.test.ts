import { describe, it } from "vitest";

import { AxiosErrorMapper } from "../../../../src/http/axios/axios-error-mapper";
import {expectedAxiosCodeCategory, expectedAxiosCodes,} from "../../../fixture/expected-mappings";

import {errorDefinitionValidator, errorCodeNamingValidator, mapperKeysValidator, mapperCategoryValidator,}
    from "../../../fixture/tools/mapper";

const AXIOS_DOMAIN = "AXIOS";

describe("AxiosErrorMapper", () => {

    describe("Keys", () => {

        it("doit contenir exactement les codes Axios supportés", () => {
            mapperKeysValidator(
                AxiosErrorMapper,
                expectedAxiosCodes,
            );
        });

    });


    describe("Code naming", () => {

        it.each(expectedAxiosCodes)(
            "doit respecter le nommage du code Axios [%s]",
            (axiosCode) => {
                errorCodeNamingValidator(
                    AxiosErrorMapper[axiosCode].code,
                    AXIOS_DOMAIN,
                    axiosCode,
                );
            }
        );

    });


    describe("Definition", () => {

        it("doit respecter la structure ErrorDefinition", () => {
            Object.values(AxiosErrorMapper).forEach((definition) => {
                errorDefinitionValidator(definition);
            });
        });

    });


    describe("Category", () => {

        it.each(expectedAxiosCodeCategory)(
            "doit associer le code Axios [%s] à la catégorie [%s]",
            (axiosCode, category) => {
                mapperCategoryValidator(AxiosErrorMapper, axiosCode, category,
                );
            }
        );

    });

});