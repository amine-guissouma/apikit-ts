import {afterAll, afterEach, beforeAll, describe, expect, it,} from "vitest";


import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {ApikitException} from "../../../../../src/exception/apikit-exception";
import {ApikitHookRegistry} from "../../../../../src/config/apikit-hook-registry";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";

import {createTestServer} from "../../../../utils/server";


const TEST_ID = "IT-HOOK-004";

describe(`Integration - apikitRequest - onError custom error - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            res.writeHead(400, {
                "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                success: false,
                message: "Erreur métier",
                error: {
                    code: "INTEGRATION_ERROR",
                    message: "Erreur générée par le serveur",
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

    it("doit utiliser l'erreur retournée par onError", async () => {

        ApikitHookRegistry.set({
            onError: [
                () =>
                    new ApikitException(
                        "CUSTOM_INTEGRATION_ERROR",
                        "Erreur personnalisée",
                        ErrorCategory.UNEXPECTED,
                        {
                            source: "integration-hooks",
                        },
                    ),
            ],
        });

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/error-hook`,
            )
        ).rejects.toMatchObject({
            code: "CUSTOM_INTEGRATION_ERROR",
            message: "Erreur personnalisée",
            errorType: ErrorCategory.UNEXPECTED,
            details: {
                source: "integration-hooks",
            },
        });
    });
});