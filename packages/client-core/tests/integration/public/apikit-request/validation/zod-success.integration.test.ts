import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";

import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-VAL-001";

describe(`Integration - apikitRequest - Zod success - ${TEST_ID}`, () => {

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

    it("doit valider les data avec Zod sur une vraie réponse HTTP", async () => {

        const schema = z.object({
            id: z.number(),
            name: z.string(),
        });

        const result = await apikitRequest(
            "GET",
            `${baseUrl}/zod-test`,
            {},
            schema,
        );

        expect(result).toEqual({
            id: 1,
            name: "Alice",
        });
    });
});