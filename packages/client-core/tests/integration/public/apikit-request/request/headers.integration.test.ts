import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-REQ-003";

describe(`Integration - apikitRequest - headers - ${TEST_ID}`, () => {

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
                    authorization: req.headers.authorization,
                    "x-api-key": req.headers["x-api-key"],
                },
            }));
        });

        baseUrl = testServer.baseUrl;
        closeServer = testServer.close;
    });

    afterAll(async () => {
        await closeServer();
    });

    it("doit envoyer les headers sur une vraie requête HTTP", async () => {

        const result = await apikitRequest(
            "GET",
            `${baseUrl}/headers-test`,
            {
                headers: {
                    Authorization: "Bearer integration-test",
                    "X-Api-Key": "secret-123",
                },
            },
        );

        expect(result).toEqual({
            authorization: "Bearer integration-test",
            "x-api-key": "secret-123",
        });
    });
});