import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApikitHookRegistry } from "../../../src/config/apikit-hook-registry";
import type { ApikitHooks } from "../../../src/config/apikit-hooks";

describe("ApikitHookRegistry", () => {

    beforeEach(() => {
        ApikitHookRegistry.set({});
    });

    it("doit retourner une configuration vide par défaut", () => {
        expect(ApikitHookRegistry.get()).toEqual({});
    });

    it("doit enregistrer un beforeRequest hooks", () => {

        const hook = vi.fn();

        ApikitHookRegistry.set({
            beforeRequest: [hook],
        });

        expect(ApikitHookRegistry.get().beforeRequest)
            .toEqual([hook]);
    });

    it("doit enregistrer un afterResponse hooks", () => {

        const hook = vi.fn();

        ApikitHookRegistry.set({
            afterResponse: [hook],
        });

        expect(ApikitHookRegistry.get().afterResponse)
            .toEqual([hook]);
    });

    it("doit enregistrer un onError hooks", () => {

        const hook = vi.fn();

        ApikitHookRegistry.set({
            onError: [hook],
        });

        expect(ApikitHookRegistry.get().onError)
            .toEqual([hook]);
    });

    it("doit fusionner les catégories de hooks", () => {

        const beforeRequest = vi.fn();
        const afterResponse = vi.fn();
        const onError = vi.fn();

        const hooks: ApikitHooks = {
            beforeRequest: [beforeRequest],
            afterResponse: [afterResponse],
            onError: [onError],
        };

        ApikitHookRegistry.set(hooks);

        expect(ApikitHookRegistry.get()).toEqual(hooks);
    });

    it("doit remplacer une catégorie de hooks existante", () => {

        const firstHook = vi.fn();
        const secondHook = vi.fn();

        ApikitHookRegistry.set({
            beforeRequest: [firstHook],
        });

        ApikitHookRegistry.set({
            beforeRequest: [secondHook],
        });

        expect(ApikitHookRegistry.get().beforeRequest)
            .toEqual([secondHook]);
    });

    it("doit conserver les catégories non modifiées", () => {

        const beforeRequest = vi.fn();
        const afterResponse = vi.fn();

        ApikitHookRegistry.set({
            beforeRequest: [beforeRequest],
            afterResponse: [afterResponse],
        });

        ApikitHookRegistry.set({
            beforeRequest: [vi.fn()],
        });

        expect(ApikitHookRegistry.get().afterResponse)
            .toEqual([afterResponse]);
    });

});