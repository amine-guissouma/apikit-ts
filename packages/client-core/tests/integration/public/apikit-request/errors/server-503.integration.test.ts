import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";


const TEST_ID = "IT-ERR-007";

describe(`Integration - apikitRequest - HTTP 503 - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            res.writeHead(503, {
                "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                success: false,
                message: "HTTP 503",
                error: {
                    code: "HTTP_503",
                    message: "Erreur HTTP 503",
                },
            }));
        });

        baseUrl = testServer.baseUrl;
        closeServer = testServer.close;
    });

    afterAll(async () => {
        await closeServer();
    });

    it("doit transformer HTTP 503 en service indisponible", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/status/503`,
            )
        ).rejects.toMatchObject({
            code: "APIKIT_HTTP_503_SERVICE_UNAVAILABLE",
            errorType: ErrorCategory.SERVER_UNAVAILABLE,
        });
    });
});