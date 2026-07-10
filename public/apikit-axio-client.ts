import {AxiosRequestConfig, AxiosResponse} from "axios";
import {ApikitResponse} from "../api/apikit-types";
import {api} from "../http/axios/axio-client";
import {apikitUnwrapper} from "../api/apikit-unwrapper";
import {ApikitException} from "../api/apikit-exception";
import {ErrorCategory} from "../errors/enum/ErrorCategory";
import {handleGlobalError} from "../errors/error-handler";
import {errorNormalizer} from "../errors/error-normalizer";
import { z } from 'zod';


export interface RequestOptions extends Omit<AxiosRequestConfig, "data"> {
    payload?: unknown;
}

export async function apikitRequest<TResponse>(
    method: string,
    url: string,
    { payload, ...config }: RequestOptions = {},
    schema?: z.ZodSchema<TResponse>,
): Promise<TResponse> {
    try {

        const response: AxiosResponse<ApikitResponse<TResponse>> = await api.request<ApikitResponse<TResponse>>({
                method,
                url,
                data: {payload:  payload},
                ...config
            });

        const data: TResponse = apikitUnwrapper(response.data);

        if (schema) {
            return schema.parse(data);
        }
        return data;

    } catch (error : unknown) {
        // transforme les exception en ApikitException
        const exception:ApikitException = errorNormalizer(error);

        if (exception.errorType !== ErrorCategory.BUSINESS) {
            handleGlobalError(exception);
        }
        throw exception;
    }
}