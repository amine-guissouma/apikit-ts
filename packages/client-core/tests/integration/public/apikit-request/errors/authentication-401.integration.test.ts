import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-ERR-003";

describe(`Integration - apikitRequest - HTTP 401 - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === "/auth/expired" &&
                req.method === "GET"
            ) {
                res.writeHead(401, {
                    "Content-Type": "application/json",
                });

                res.end(JSON.stringify({
                    success: false,
                    message: "Token expiré",
                    error: {
                        code: "TOKEN_EXPIRED",
                        message: "Token expiré",
                    },
                }));

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

    it("doit transformer une réponse HTTP 401 en erreur AUTHENTICATION", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/auth/expired`,
            )
        ).rejects.toMatchObject({
            code: "APIKIT_HTTP_401_AUTHENTICATION_ERROR",
            errorType: "AUTHENTICATION",
        });
    });
});