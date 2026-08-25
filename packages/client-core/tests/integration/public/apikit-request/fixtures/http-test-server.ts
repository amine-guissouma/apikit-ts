import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {  } from "../fixtures/http-test-server";
import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-ERR-001";

describe(`Integration - apikitRequest - business error - ${TEST_ID}`, () => {
    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === "/users/not-found" &&
                req.method === "GET"
            ) {
                res.writeHead(400, {
                    "Content-Type": "application/json",
                });

                res.end(JSON.stringify({
                    success: false,
                    message: "Erreur métier",
                    error: {
                        code: "USER_NOT_FOUND",
                        message: "Utilisateur introuvable",
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

    it("doit transformer une réponse HTTP ApiKit en ApikitException", async () => {

        await expect(
            apikitRequest(
                "GET",
                `${baseUrl}/users/not-found`,
            )
        ).rejects.toMatchObject({
            code: "USER_NOT_FOUND",
            message: "Utilisateur introuvable",
        });
    });

});