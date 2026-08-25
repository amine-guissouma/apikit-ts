// apikit.ts

import { z } from "zod";
import {apikitRequest, RequestOptions} from "./apikit-axio-client";

export class Apikit {

    request<T>(
        method: string,
        url: string,
        options: RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return apikitRequest(method, url, options, schema);
    }

    get<T>(
        url: string,
        config?:RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("GET", url, {...(config as RequestOptions), payload: undefined as never,}, schema);
    }

    delete<T>(
        url: string,
        config?:RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("DELETE", url, {...(config as RequestOptions), payload: undefined as never,}, schema);
    }

    head<T>(
        url: string,
        config?: RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("HEAD", url, {...(config as RequestOptions), payload: undefined as never,}, schema);
    }

    options<T>(
        url: string,
        config?: RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("OPTIONS", url, {...(config as RequestOptions), payload: undefined as never,}, schema);
    }

    post<T>(
        url: string,
        payload: unknown,
        config?: RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("POST", url, {...config, payload,}, schema);
    }

    put<T>(
        url: string,
        payload: unknown,
        config?:RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("PUT", url, {...config, payload,}, schema);
    }

    patch<T>(
        url: string,
        payload: unknown,
        config?:RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("PATCH", url, {...config, payload,}, schema);
    }

    purge<T>(
        url: string,
        payload?: unknown,
        config?: RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("PURGE", url, {...config, payload,}, schema,);
    }

    link<T>(
        url: string,
        payload?: unknown,
        config?: RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("LINK", url, {...config, payload,}, schema,);
    }

    unlink<T>(
        url: string,
        payload?: unknown,
        config?: RequestOptions,
        schema?: z.ZodSchema<T>,
    ): Promise<T> {
        return this.request("UNLINK", url, {...config, payload,}, schema,);
    }
}

export const apikit = new Apikit(); 