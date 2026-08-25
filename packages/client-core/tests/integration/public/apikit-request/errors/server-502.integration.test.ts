import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-ERR-006";

describe(`Integration - apikitRequest - HTTP 502 - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            res.writeHead(502, {
                "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                success: false,
                message: "HTTP 502",
                error: {
                    code: "HTTP_502",
                    message: "Erreur HTTP 502",
                },
            }));
        });

        baseUrl = testServer.baseUrl;
        closeServer = testServer.close;
    });

    afterAll(async () => {
        await closeServer();
    });

    it("doit transformer HTTP 502 en serveur indisponible", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/status/502`,
            )
        ).rejects.toMatchObject({
            code: "APIKIT_HTTP_502_PROXY_GATEWAY_ERROR",
            errorType: ErrorCategory.SERVER_UNAVAILABLE,
        });
    });
});