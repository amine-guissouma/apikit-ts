import {afterAll, beforeAll, describe, expect, it,} from "vitest";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-REQ-004";

describe(`Integration - apikitRequest - POST payload - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === "/users" &&
                req.method === "POST"
            ) {
                let body = "";

                req.on("data", (chunk) => {
                    body += chunk;
                });

                req.on("end", () => {

                    const payload = JSON.parse(body);

                    res.writeHead(200, {
                        "Content-Type": "application/json",
                    });

                    res.end(JSON.stringify({
                        success: true,
                        message: "Utilisateur créé",
                        data: {
                            received: payload,
                        },
                    }));
                });

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

    it("doit envoyer les données d'une requête POST sur une vraie requête HTTP", async () => {

        const result = await apikitRequest(
            "POST",
            `${baseUrl}/users`,
            {
                payload: {
                    name: "Bob",
                    email: "bob@example.com",
                },
            },
        );

        expect(result).toEqual({
            received: {
                payload: {
                    name: "Bob",
                    email: "bob@example.com",
                },
            },
        });
    });
});