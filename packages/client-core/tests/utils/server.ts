import * as http from "node:http";

export interface TestServer {
    server: http.Server;
    baseUrl: string;
    close: () => Promise<void>;
}

export async function createTestServer(
    handler: http.RequestListener,
): Promise<TestServer> {

    const server = http.createServer(handler);

    await new Promise<void>((resolve) => {
        server.listen(0, "127.0.0.1", () => {
            resolve();
        });
    });

    const address = server.address();

    if (!address || typeof address === "string") {
        throw new Error(
            "Impossible de récupérer le port du serveur"
        );
    }

    const baseUrl = `http://127.0.0.1:${address.port}`;

    return {
        server,
        baseUrl,

        close: async () => {
            await new Promise<void>((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                });
            });
        },
    };
}


