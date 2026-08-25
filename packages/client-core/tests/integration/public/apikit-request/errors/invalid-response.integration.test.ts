import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-ERR-002";

describe(`Integration - apikitRequest - invalid response - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === "/users/invalid-contract" &&
                req.method === "GET"
            ) {
                res.writeHead(200, {
                    "Content-Type": "application/json",
                });

                res.end(JSON.stringify({
                    success: true,
                    data: {
                        id: 1,
                        name: "Alice",
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

    it("doit détecter un contrat ApiKit invalide", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/users/invalid-contract`,
            )
        ).rejects.toMatchObject({
            code: "APIKIT_RESPONSE_INVALID",
            errorType: "CONTRACT",
        });
    });
});