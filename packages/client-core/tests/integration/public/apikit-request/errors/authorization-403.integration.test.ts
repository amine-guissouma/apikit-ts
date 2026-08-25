import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";


const TEST_ID = "IT-ERR-004";

describe(`Integration - apikitRequest - HTTP 403 - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === "/admin/users" &&
                req.method === "GET"
            ) {
                res.writeHead(403, {
                    "Content-Type": "application/json",
                });

                res.end(JSON.stringify({
                    success: false,
                    message: "Accès interdit",
                    error: {
                        code: "ACCESS_DENIED",
                        message: "Vous n'avez pas les droits nécessaires.",
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

    it("doit transformer une réponse HTTP 403 en erreur AUTHORIZATION", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/admin/users`,
            )
        ).rejects.toMatchObject({
            code: "APIKIT_HTTP_403_AUTHORIZATION_ERROR",
            errorType: "AUTHORIZATION",
        });
    });
});