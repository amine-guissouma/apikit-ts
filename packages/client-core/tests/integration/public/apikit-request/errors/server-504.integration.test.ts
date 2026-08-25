import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-ERR-008";

describe(`Integration - apikitRequest - HTTP 504 - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            res.writeHead(504, {
                "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                success: false,
                message: "HTTP 504",
                error: {
                    code: "HTTP_504",
                    message: "Erreur HTTP 504",
                },
            }));
        });

        baseUrl = testServer.baseUrl;
        closeServer = testServer.close;
    });

    afterAll(async () => {
        await closeServer();
    });

    it("doit transformer HTTP 504 en timeout serveur", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/status/504`,
            )
        ).rejects.toMatchObject({
            code: "APIKIT_HTTP_504_TIMEOUT",
            errorType: ErrorCategory.SERVER_UNAVAILABLE,
        });
    });
});