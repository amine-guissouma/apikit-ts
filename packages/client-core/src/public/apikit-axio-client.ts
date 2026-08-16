import {AxiosRequestConfig} from "axios";
import {z} from "zod";

import {api} from "../http/axios/axio-client";
import {apikitUnwrapper} from "../contracts/response/apikit-unwrapper";
import {ApikitException} from "../exception/apikit-exception";
import {handleGlobalError} from "../errors/handler/error-handler";
import {errorNormalizer} from "../errors/handler/error-normalizer";
import {shouldHandleGlobalError} from "../errors/handler/should-handle-global-error";
import {ApikitHookRegistry} from "../config/apikit-hook-registry";


export interface RequestOptions
    extends Omit<AxiosRequestConfig, "data"> {

    payload?: unknown;
}



/** Exécute une la pipline de la requête Apikit complète*/

async function executeRequest<TResponse>(
    requestConfig: AxiosRequestConfig,
    schema?: z.ZodSchema<TResponse>
): Promise<TResponse> {
    const hooks = ApikitHookRegistry.get();

    // Point d'extension utilisateur avant l'envoi de la requête
    let finalConfig = requestConfig;
    for(const hook of hooks.beforeRequest ?? []){
        finalConfig = await hook(finalConfig);
    }
    // Exécution de la requête HTTP
    let response = await api.request(finalConfig);

    // Point d'extension utilisateur après une réponse réussie

    for(const hook of hooks.afterResponse ?? []){
        response = await hook(response);
    }

    // Recupere la reponse de la requette
    const data:TResponse = apikitUnwrapper(response.data);

    // Vérifie la reponse correspond au contrat
    if(schema){
        return schema.parse(data);
    }

    // retourne reponse
    return data;
}


/** * Exécute une la pipline en cas d'erreur*/
async function processError<TResponse>(
    error:unknown
):Promise<TResponse>{

    // Normalisation de toutes les erreurs en ApikitException
    let exception:ApikitException = errorNormalizer(error);

    // Point d'extension utilisateur après normalisation de l'erreur
    const hooks = ApikitHookRegistry.get();
    for(const hook of hooks.onError ?? []){
        try{
            exception = await hook(exception);
        } catch(e){
            exception = errorNormalizer(e);
        }
    }

    // Gestion globale de l'erreur (UI, logs...)
    if(shouldHandleGlobalError(exception)){
        handleGlobalError(exception);
    }

    // Propagation de l'exception normalisée
    throw exception;
}

/** Exécute une une requette apikit*/
export async function apikitRequest<TResponse>(
    method: string,
    url: string,
    { payload, ...config }: RequestOptions = {},
    schema?: z.ZodSchema<TResponse>,

): Promise<TResponse> {
    const requestConfig: AxiosRequestConfig = {method, url, data:{payload}, ...config};
    try {
        return await executeRequest<TResponse>(requestConfig, schema);
    } catch (error : unknown) {
        return await processError<TResponse>(error);
    }
}