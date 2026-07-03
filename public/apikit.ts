// apikit.ts

import { z } from "zod";
import {apikitRequest, RequestOptions,Method} from "./apikit-axio-client";

export class Apikit {

    request<TResponse>(
        method: Method,
        url: string,
        options: RequestOptions,
        schema?: z.ZodSchema<TResponse>,
    ): Promise<TResponse> {
        return apikitRequest(method, url, options, schema);
    }

    get<TResponse>(
        url: string,
        config?:RequestOptions,
        schema?: z.ZodSchema<TResponse>,
    ): Promise<TResponse> {
        return this.request(Method.GET, url, {...(config as any), payload: undefined as never,}, schema);
    }

    post<TResponse>(
        url: string,
        payload: unknown,
        config?: RequestOptions,
        schema?: z.ZodSchema<TResponse>,
    ): Promise<TResponse> {
        console.log(payload);
        return this.request(Method.POST, url, {...config, payload,}, schema);
    }

    put<TResponse>(
        url: string,
        payload: unknown,
        config?:RequestOptions,
        schema?: z.ZodSchema<TResponse>,
    ): Promise<TResponse> {
        return this.request(Method.PUT, url, {...config, payload,}, schema);
    }

    patch<TResponse>(
        url: string,
        payload: unknown,
        config?:RequestOptions,
        schema?: z.ZodSchema<TResponse>,
    ): Promise<TResponse> {
        return this.request(Method.PATCH, url, {...config, payload,}, schema);
    }

    delete<TResponse>(
        url: string,
        config?:RequestOptions,
        schema?: z.ZodSchema<TResponse>,
    ): Promise<TResponse> {
        return this.request(Method.DELETE, url, {...(config as any), payload: undefined as never,}, schema);
    }
}

export const apikit = new Apikit();