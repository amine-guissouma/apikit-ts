import { beforeEach, describe, expect, it, vi } from "vitest";

import { Apikit } from "../../../src/public/apikit";
import { apikitRequest } from "../../../src/public/apikit-axio-client";

import type { RequestOptions } from "../../../src/public/apikit-axio-client";

vi.mock("../../../src/public/apikit-axio-client", () => ({
    apikitRequest: vi.fn(),
}));

describe("Unit - Apikit", () => {

    let apikit: Apikit;

    beforeEach(() => {
        vi.clearAllMocks();

        apikit = new Apikit();
    });


    // =========================================================
    // request()
    // =========================================================

    it("request() doit appeler apikitRequest avec les bons paramètres", async () => {

        const options: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        const schema = undefined;

        vi.mocked(apikitRequest).mockResolvedValue({
            id: 1,
        });

        const result = await apikit.request(
            "GET",
            "/users/1",
            options,
            schema,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "GET",
            "/users/1",
            options,
            schema,
        );

        expect(result).toEqual({
            id: 1,
        });
    });


    // =========================================================
    // GET
    // =========================================================

    it("get() doit appeler apikitRequest avec GET", async () => {

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        const schema = undefined;

        vi.mocked(apikitRequest).mockResolvedValue({
            id: 1,
        });

        const result = await apikit.get(
            "/users/1",
            config,
            schema,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "GET",
            "/users/1",
            {
                ...config,
                payload: undefined,
            },
            schema,
        );

        expect(result).toEqual({
            id: 1,
        });
    });


    // =========================================================
    // DELETE
    // =========================================================

    it("delete() doit appeler apikitRequest avec DELETE", async () => {

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({
            deleted: true,
        });

        const result = await apikit.delete(
            "/users/1",
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "DELETE",
            "/users/1",
            {
                ...config,
                payload: undefined,
            },
            undefined,
        );

        expect(result).toEqual({
            deleted: true,
        });
    });


    // =========================================================
    // HEAD
    // =========================================================

    it("head() doit appeler apikitRequest avec HEAD", async () => {

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({exists: true,});

        const result = await apikit.head(
            "/users/1",
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "HEAD",
            "/users/1",
            {
                ...config,
                payload: undefined,
            },
            undefined,
        );

        expect(result).toEqual({
            exists: true,
        });
    });


    // =========================================================
    // OPTIONS
    // =========================================================

    it("options() doit appeler apikitRequest avec OPTIONS", async () => {

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({
            methods: ["GET", "POST"],
        });

        const result = await apikit.options(
            "/users",
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "OPTIONS",
            "/users",
            {
                ...config,
                payload: undefined,
            },
            undefined,
        );

        expect(result).toEqual({
            methods: ["GET", "POST"],
        });
    });


    // =========================================================
    // POST
    // =========================================================

    it("post() doit appeler apikitRequest avec POST et le payload", async () => {

        const payload = {
            name: "Alice",
            email: "alice@example.com",
        };

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({
            id: 1,
            name: "Alice",
        });

        const result = await apikit.post(
            "/users",
            payload,
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "POST",
            "/users",
            {
                ...config,
                payload,
            },
            undefined,
        );

        expect(result).toEqual({
            id: 1,
            name: "Alice",
        });
    });


    // =========================================================
    // PUT
    // =========================================================

    it("put() doit appeler apikitRequest avec PUT et le payload", async () => {

        const payload = {
            name: "Alice updated",
        };

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({
            id: 1,
            name: "Alice updated",
        });

        const result = await apikit.put(
            "/users/1",
            payload,
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "PUT",
            "/users/1",
            {
                ...config,
                payload,
            },
            undefined,
        );

        expect(result).toEqual({
            id: 1,
            name: "Alice updated",
        });
    });


    // =========================================================
    // PATCH
    // =========================================================

    it("patch() doit appeler apikitRequest avec PATCH et le payload", async () => {

        const payload = {
            name: "Alice patched",
        };

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({
            id: 1,
            name: "Alice patched",
        });

        const result = await apikit.patch(
            "/users/1",
            payload,
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "PATCH",
            "/users/1",
            {
                ...config,
                payload,
            },
            undefined,
        );

        expect(result).toEqual({
            id: 1,
            name: "Alice patched",
        });
    });


    // =========================================================
    // PURGE
    // =========================================================

    it("purge() doit appeler apikitRequest avec PURGE et le payload", async () => {

        const payload = {
            cacheKey: "users",
        };

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({
            purged: true,
        });

        const result = await apikit.purge(
            "/cache",
            payload,
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "PURGE",
            "/cache",
            {
                ...config,
                payload,
            },
            undefined,
        );

        expect(result).toEqual({
            purged: true,
        });
    });


    // =========================================================
    // LINK
    // =========================================================

    it("link() doit appeler apikitRequest avec LINK et le payload", async () => {

        const payload = {
            relation: "friend",
        };

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({
            linked: true,
        });

        const result = await apikit.link(
            "/users/1",
            payload,
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "LINK",
            "/users/1",
            {
                ...config,
                payload,
            },
            undefined,
        );

        expect(result).toEqual({
            linked: true,
        });
    });


    // =========================================================
    // UNLINK
    // =========================================================

    it("unlink() doit appeler apikitRequest avec UNLINK et le payload", async () => {

        const payload = {
            relation: "friend",
        };

        const config: RequestOptions = {
            headers: {
                Authorization: "Bearer test",
            },
        };

        vi.mocked(apikitRequest).mockResolvedValue({
            unlinked: true,
        });

        const result = await apikit.unlink(
            "/users/1",
            payload,
            config,
        );

        expect(apikitRequest).toHaveBeenCalledTimes(1);

        expect(apikitRequest).toHaveBeenCalledWith(
            "UNLINK",
            "/users/1",
            {
                ...config,
                payload,
            },
            undefined,
        );

        expect(result).toEqual({
            unlinked: true,
        });
    });

});