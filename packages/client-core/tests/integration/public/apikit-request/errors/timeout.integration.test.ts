import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-ERR-010";

describe(`Integration - apikitRequest - timeout - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === "/timeout" &&
                req.method === "GET"
            ) {
                // volontairement aucune réponse
                return;
            }

            res.writeHead(404);
            res.end();
        });

        baseUrl = testServer.baseUrl;
        closeServer = testServer.close;
    });

    afterAll(async () => {
        await closeServer();
    });

    it("doit détecter un timeout serveur", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/timeout`,
                {
                    timeout: 50,
                },
                undefined,
            )
        ).rejects.toMatchObject({
            code: "APIKIT_AXIOS_NETWORK_TIMEOUT",
            errorType: ErrorCategory.TECHNICAL,
        });
    });
});