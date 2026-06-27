import {AxiosRequestConfig, AxiosResponse} from "axios";
import {ApikitResponse} from "../api/types";
import {api} from "../axios/client";
import {unwrap} from "../api/unwrap";
import {ApikitException} from "../api/ApikitException";
import {ErrorCategory} from "../errors/ErrorCategory";
import {handleGlobalError} from "../errors/ErrorEngine";
import {errorNormalizer} from "../errors/ErrorNormalizer";


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
interface RequestOptions extends Omit<AxiosRequestConfig, "data"> {
    payload?: unknown;
}

export async function apikitRequest<T>(
    method: Method,
    url: string,
    { payload, ...config }: RequestOptions = {}
): Promise<T> {

    try {

        const response : AxiosResponse<ApikitResponse<T>> = await api.request<ApikitResponse<T>>({
            method,
            url,
            data: {payloads:payload},
            ...config
        });
        return unwrap(response.data);

    } catch (error) {
        // transforme les exception en ApikitException
        const exception:ApikitException = errorNormalizer(error);

        if (exception.errorType === ErrorCategory.GLOBAL) {
            handleGlobalError(exception);
        }

        throw exception;
    }
}