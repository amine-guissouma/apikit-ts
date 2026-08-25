import {afterAll, afterEach, beforeAll, describe, expect, it,} from "vitest";

import {ApikitHookRegistry} from "../../../../../src/config/apikit-hook-registry";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-HOOK-001";

describe(`Integration - apikitRequest - beforeRequest - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === "/auth-test" &&
                req.method === "GET"
            ) {
                res.writeHead(200, {
                    "Content-Type": "application/json",
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "OK",
                    data: {
                        authorization: req.headers.authorization,
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

    afterEach(() => {
        ApikitHookRegistry.clear();
    });

    it("doit exécuter beforeRequest sur une vraie requête HTTP", async () => {

        ApikitHookRegistry.set({
            beforeRequest: [
                (config) => ({
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization: "Bearer integration-test",
                    },
                }),
            ],
        });

        const result = await apikitRequest(
            "GET",
            `${baseUrl}/auth-test`,
        );

        expect(result).toEqual({
            authorization: "Bearer integration-test",
        });
    });
});