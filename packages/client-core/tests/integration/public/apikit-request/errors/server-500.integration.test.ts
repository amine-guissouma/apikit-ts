import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";


const TEST_ID = "IT-ERR-005";

describe(`Integration - apikitRequest - HTTP 500 - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            res.writeHead(500, {
                "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                success: false,
                message: "HTTP 500",
                error: {
                    code: "HTTP_500",
                    message: "Erreur HTTP 500",
                },
            }));
        });

        baseUrl = testServer.baseUrl;
        closeServer = testServer.close;
    });

    afterAll(async () => {
        await closeServer();
    });

    it("doit transformer HTTP 500 en erreur serveur inattendue", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/status/500`,
            )
        ).rejects.toMatchObject({
            code: "APIKIT_HTTP_500_UNKNOWN_SERVER_ERROR",
            errorType: ErrorCategory.SERVER_UNEXPECTED,
        });
    });
});