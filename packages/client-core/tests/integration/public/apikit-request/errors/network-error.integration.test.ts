import { describe, expect, it } from "vitest";

import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {ApikitAxiosErrorCode} from "../../../../../src/http/axios/enum/ApikitAxiosErrorCode";


const TEST_ID = "IT-ERR-009";

describe(`Integration - apikitRequest - network error - ${TEST_ID}`, () => {

    it("doit détecter un serveur inaccessible", async () => {

        await expect(
            apikitRequest(
                "GET",
                "http://127.0.0.1:59999/test",
            )
        ).rejects.toMatchObject({
            code: ApikitAxiosErrorCode.APIKIT_AXIOS_ECONNREFUSED,
            errorType: ErrorCategory.TECHNICAL,
        });
    });
});