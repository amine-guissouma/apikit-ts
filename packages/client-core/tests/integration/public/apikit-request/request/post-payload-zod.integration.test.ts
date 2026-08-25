import {afterAll, beforeAll, describe, expect, it,} from "vitest";

import { z } from "zod";

import {apikitRequest} from "../../../../../src/public/apikit-axio-client";
import {createTestServer} from "../../../../utils/server";

const TEST_ID = "IT-REQ-005";

describe(`Integration - apikitRequest - POST payload + Zod - ${TEST_ID}`, () => {

    let baseUrl: string;
    let closeServer: () => Promise<void>;

    beforeAll(async () => {

        const testServer = await createTestServer((req, res) => {

            if (
                req.url === "/users/zod" &&
                req.method === "POST"
            ) {
                let body = "";

                req.on("data", (chunk) => {
                    body += chunk;
                });

                req.on("end", () => {

                    const data = JSON.parse(body);

                    res.writeHead(200, {
                        "Content-Type": "application/json",
                    });

                    res.end(JSON.stringify({
                        success: true,
                        message: "Utilisateur créé",
                        data: {
                            id: 2,
                            name: data.payload.name,
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

    it("doit envoyer un payload POST et valider la réponse avec Zod", async () => {

        const schema = z.object({
            id: z.number(),
            name: z.string(),
        });

        const result = await apikitRequest(
            "POST",
            `${baseUrl}/users/zod`,
            {
                payload: {
                    name: "Bob",
                    email: "bob@example.com",
                },
            },
            schema,
        );

        expect(result).toEqual({
            id: 2,
            name: "Bob",
        });
    });
});