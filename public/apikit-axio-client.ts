import {AxiosRequestConfig, AxiosResponse} from "axios";
import {ApikitResponse} from "../api/apikit-types";
import {api} from "../http/axios/axio-client";
import {apikitUnwrapper} from "../api/apikit-unwrapper";
import {ApikitException} from "../api/apikit-exception";
import {ErrorCategory} from "../errors/enum/ErrorCategory";
import {handleGlobalError} from "../errors/error-handler";
import {errorNormalizer} from "../errors/error-normalizer";
import { z } from 'zod';


export enum Method {
    GET ="get",
    DELETE = "delete",
    HEAD = "head",
    OPTIONS = "options" ,
    POST = "post" ,
    PUT = "put" ,
    PATCH = "patch" ,
    PURGE = "purge" ,
    LINK = "link" ,
    UNLINK = "unlink" ,
}


export interface RequestOptions extends Omit<AxiosRequestConfig, "data"> {
    payload?: unknown;
}

export async function apikitRequest<T>(
    method: Method,
    url: string,
    { payload, ...config }: RequestOptions = {},
    schema?: z.ZodSchema<T>,
): Promise<T> {
    try {

        const response : AxiosResponse<ApikitResponse<T>> = await api.request<ApikitResponse<T>>({
            method,
            url,
            data: {payload:payload},
            ...config
        });
        const data: T = apikitUnwrapper(response.data);
        if (schema)  {
            return schema.parse(data);
        }
        return data

    } catch (error) {
        // transforme les exception en ApikitException
        const exception:ApikitException = errorNormalizer(error);

        if (exception.errorType === ErrorCategory.SERVER_UNHANDLED) {
            handleGlobalError(exception);
        }
        throw exception;
    }
}