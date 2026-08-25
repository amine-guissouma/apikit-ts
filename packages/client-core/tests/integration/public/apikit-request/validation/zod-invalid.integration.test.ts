import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import {ErrorCategory} from "../../../../../src/errors/enum/ErrorCategory";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";

import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-VAL-002";

describe(`Integration - apikitRequest - Zod invalid - ${TEST_ID}`, () => {

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
                    id: 1,
                    name: "Alice",
                },
            }));
        });

        baseUrl = testServer.baseUrl;
        closeServer = testServer.close;
    });

    afterAll(async () => {
        await closeServer();
    });

    it("doit détecter une violation Zod sur une vraie réponse HTTP", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/zod-test`,
                {},
                z.object({
                    id: z.string(),
                    name: z.string(),
                }),
            )
        ).rejects.toMatchObject({
            code: "APIKIT_ZOD_SCHEMA_INVALID",
            errorType: ErrorCategory.CONTRACT,
        });
    });
});