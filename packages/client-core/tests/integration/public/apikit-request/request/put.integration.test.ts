import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";

import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-REQ-006";

describe(`Integration - apikitRequest - PUT - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (req.url === "/method-test" && req.method === "PUT"
            ) {
                res.writeHead(200, {
                    "Content-Type": "application/json",
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "OK",
                    data: {
                        method: req.method,
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

    it("doit envoyer correctement une requête HTTP PUT", async () => {

        const result = await apikitRequest("PUT", `${baseUrl}/method-test`,);
        expect(result).toEqual({method: "PUT",});
    });
});