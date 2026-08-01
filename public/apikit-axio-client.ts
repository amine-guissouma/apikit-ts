import {AxiosRequestConfig, AxiosResponse} from "axios";
import {api} from "../http/axios/axio-client";
import {apikitUnwrapper} from "../api/apikit-unwrapper";
import {ApikitException} from "../api/apikit-exception";
import {handleGlobalError} from "../errors/error-handler";
import {errorNormalizer} from "../errors/error-normalizer";
import { z } from 'zod';
import {shouldHandleGlobalError} from "../errors/should-handle-global-error";
import {ApikitHookRegistry} from "../config/apikit-hook-registry";

export interface RequestOptions extends Omit<AxiosRequestConfig, "data"> {
    payload?: unknown;
}

export async function apikitRequest<TResponse>(
    method: string,
    url: string,
    { payload, ...config }: RequestOptions = {},
    schema?: z.ZodSchema<TResponse>,
): Promise<TResponse> {
    const hooks = ApikitHookRegistry.get();

    try {
        let requestConfig: AxiosRequestConfig  = {
            method,
            url,
            data:{payload},
            ...config
        };
        // Point d'extension utilisateur avant l'envoi de la requête
        for(const hook of hooks.beforeRequest ?? []){
            requestConfig = await hook(requestConfig);
        }
        // Exécution de la requête HTTP
        const response = await api.request(requestConfig);


        // Point d'extension utilisateur après une réponse réussie
        let processedResponse = response;

        for(const hook of hooks.afterResponse ?? []){
            processedResponse = await hook(processedResponse);
        }

        // Recupere la reponse de la requette
        const data: TResponse = apikitUnwrapper(processedResponse.data);

        // Vérifie la reponse correspond au contrat
        if (schema) {
            return schema.parse(data);
        }

        // retourne reponse
        return data;

    } catch (error : unknown) {

        // Normalisation de toutes les erreurs en ApikitException
        let exception:ApikitException = errorNormalizer(error);

        // Point d'extension utilisateur après normalisation de l'erreur
        for(const hook of hooks.onError ?? []){
            try {
                exception = await hook(exception);
            } catch(e){
                exception = errorNormalizer(e);
            }
        }

        // Gestion globale de l'erreur (UI, logs...)
        if (shouldHandleGlobalError(exception)){
            handleGlobalError(exception);
        }

        // Propagation de l'exception normalisée
        throw exception;
    }
}