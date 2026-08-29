import { describe, it } from "vitest";

import { HttpStatusMapper } from "../../../../src/http/status/http-status-mapper";
import { expectedHttpStatusCategory, expectedHttpStatus} from "../../../fixture/expected-mappings";
import {
    errorDefinitionValidator,
    errorCodeNamingValidator,
    mapperKeysValidator,
    mapperCategoryValidator
} from "../../../fixture/tools/mapper";


describe("HttpStatusMapper", () => {

    describe("Structure", () => {
        it("doit contenir exactement les statuts HTTP supportés", () => {
            mapperKeysValidator(HttpStatusMapper, expectedHttpStatus.map(String));
        });
        it("doit respecter la structure ErrorDefinition", () => {
            Object.values(HttpStatusMapper).forEach((definition) => {
                errorDefinitionValidator(definition);
            });
        });
    });

    describe("Nommage", () => {
        it.each(expectedHttpStatus)(
            "doit respecter le nommage du code d'erreur pour le status HTTP $0",
            (status) => {
                const HTTP_DOMAIN = "HTTP";
                errorCodeNamingValidator(HttpStatusMapper[status].code, HTTP_DOMAIN, status.toString(),);
            }
        );
    });


    describe("Catégories", () => {
        it.each(expectedHttpStatusCategory)(
            "doit associer le statut HTTP [%s] à la catégorie [%s]",
            (status, category) => {
                mapperCategoryValidator(HttpStatusMapper, status, category,);
            }
        );
    });


});
