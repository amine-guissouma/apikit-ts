import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-REQ-001";

const URL = "/users/1";
const METHOD = "GET";
const STATUS_CODE = 200;

const EXPECTED = {
    id: 1,
    name: "Alice",
};

const APIKIT_RESPONSE = {
    success: true,
    message: "OK",
    data: EXPECTED,
};

describe(`Integration - apikitRequest - success - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === URL &&
                req.method === METHOD
            ) {
                res.writeHead(STATUS_CODE, {
                    "Content-Type": "application/json",
                });

                res.end(JSON.stringify(APIKIT_RESPONSE));
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

    it("doit récupérer les data depuis une vraie réponse HTTP ApiKit", async () => {

        const result = await apikitRequest(
            METHOD,
            `${baseUrl}${URL}`,
        );

        expect(result).toEqual(EXPECTED);
    });
});