import {AxiosRequestConfig, AxiosResponse} from "axios";
import {ApikitResponse} from "../api/apikit-types";
import {api} from "../http/axios/axio-client";
import {apikitUnwrapper} from "../api/apikit-unwrapper";
import {ApikitException} from "../api/apikit-exception";
import {handleGlobalError} from "../errors/error-handler";
import {errorNormalizer} from "../errors/error-normalizer";
import { z } from 'zod';
import {shouldHandleGlobalError} from "../errors/should-handle-global-error";


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
        // exeuete la requette
        const response: AxiosResponse<ApikitResponse<TResponse>> = await api.request<ApikitResponse<TResponse>>({
                method,
                url,
                data: {payload:  payload},
                ...config
            });

        // recupere la reponse de la requette
        const data: TResponse = apikitUnwrapper(response.data);

        // verifie la reponse corresepon au contrat
        if (schema) {
            return schema.parse(data);
        }

        // retourne reponse
        return data;

    } catch (error : unknown) {

        // normalise les exceptions en ApikitExceptions
        const exception:ApikitException = errorNormalizer(error);

        // Gère l'affichages des exeptions
        if (shouldHandleGlobalError(exception)){
            handleGlobalError(exception);
        }
        // Dans tous les cas leves l'exeption normaliser apikit
        throw exception;
    }
}