import { describe, expect, it } from "vitest";

import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";


const TEST_ID = "IT-ERR-009";

describe(`Integration - apikitRequest - network error - ${TEST_ID}`, () => {

    it("doit détecter un serveur inaccessible", async () => {

        await expect(
            apikitRequest(
                "GET",
                "http://127.0.0.1:59999/test",
            )
        ).rejects.toMatchObject({
            code: "APIKIT_NETWORK_ERROR",
            errorType: ErrorCategory.TECHNICAL,
        });
    });
});