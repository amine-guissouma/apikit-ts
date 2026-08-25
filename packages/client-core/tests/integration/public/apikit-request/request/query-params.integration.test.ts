import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-REQ-002";

describe(`Integration - apikitRequest - query params - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            const url = new URL(
                req.url ?? "",
                "http://localhost",
            );

            res.writeHead(200, {
                "Content-Type": "application/json",
            });

            res.end(JSON.stringify({
                success: true,
                message: "OK",
                data: {
                    id: url.searchParams.get("id"),
                    search: url.searchParams.get("search"),
                },
            }));
        });

        baseUrl = testServer.baseUrl;
        closeServer = testServer.close;
    });

    afterAll(async () => {
        await closeServer();
    });

    it("doit envoyer les paramètres de requête sur une vraie requête HTTP", async () => {

        const result = await apikitRequest(
            "GET",
            `${baseUrl}/users`,
            {
                params: {
                    id: 1,
                    search: "Alice",
                },
            },
        );

        expect(result).toEqual({
            id: "1",
            search: "Alice",
        });
    });
});