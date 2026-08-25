import {afterAll, afterEach, beforeAll, describe, expect, it,} from "vitest";

import {ApikitHookRegistry} from "../../../../../src/config/apikit-hook-registry";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-HOOK-002";

describe(`Integration - apikitRequest - afterResponse - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            res.writeHead(200, {
                "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                success: true,
                message: "OK",
                data: {
                    value: "original",
                },
            }));
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

    it("doit exécuter afterResponse sur une vraie réponse HTTP", async () => {

        ApikitHookRegistry.set({
            afterResponse: [
                (response) => ({
                    ...response,
                    data: {
                        ...response.data,
                        data: {
                            value: "modified-by-hooks",
                        },
                    },
                }),
            ],
        });

        const result = await apikitRequest(
            "GET",
            `${baseUrl}/response-hook`,
        );

        expect(result).toEqual({
            value: "modified-by-hooks",
        });
    });
});