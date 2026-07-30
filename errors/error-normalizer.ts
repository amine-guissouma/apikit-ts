import {ApikitException} from "../api/apikit-exception";
import axios, {AxiosError} from "axios";
import {ErrorCategory} from "./enum/ErrorCategory";
import {ErrorDefinition, getMappedError} from "../http/mapper-error-tool";
import {AxiosErrorMapper} from "../http/axios/axios-error-mapper";
import {errorClassifier} from "./error-classifier";
import {ZodError} from "zod";






export const errorNormalizer = (error: unknown): ApikitException => {

    //------------------------------------------------
    // Déjà une exception Apikit
    //------------------------------------------------

    if (error instanceof ApikitException) {
        return error;
    }

    //------------------------------------------------
    // Pas une erreur Axios
    //------------------------------------------------

    //------------------------------------------------
    // erreur Zod
    //------------------------------------------------
    if (error instanceof ZodError) {
        return new ApikitException(
            "DATA_SCHEMA_INVALID",
            "API contract violation",
            ErrorCategory.CONTRACT,
            error.issues
        );
    }

    //------------------------------------------------
    // erreur SERVER attendue mais non controler
    //------------------------------------------------
    if (!axios.isAxiosError(error)) {
        return new ApikitException(
            "UNKNOWN_ERROR",
            "Une erreur service non controler.",
            ErrorCategory.UNEXPECTED
        );
    }
    //------------------------------------------------
    // erreur SERVER inattendue
    //------------------------------------------------
    if (error.status === 500) {
        return new ApikitException(
            "UNKNOWN_ERROR_ERROR",
            "Une erreur inattendue est survenue.",
            ErrorCategory.SERVER_UNEXPECTED
        );
    }

    //------------------------------------------------
    // erreur AUTHENTICATION
    //------------------------------------------------
    if (error.status === 401) {
        return new ApikitException(
            "AUTHENTICATION_ERROR",
            "Token expiré .",
            ErrorCategory.AUTHENTICATION
        );
    }

    //------------------------------------------------
    // erreur AUTHORIZATION
    //------------------------------------------------
    if (error.status === 403) {
        return new ApikitException(
            "AUTHORIZATION_ERROR",
            "Accès interdit",
            ErrorCategory.AUTHORIZATION
        );
    }


    //------------------------------------------------
    // erreur AUTHENTICATION
    //------------------------------------------------
    if (error.status === 502) {
        return new ApikitException(
            "PROXY_GATEWAY_ERROR",
            "Infrastructure ou communication .",
            ErrorCategory.SERVER_UNAVAILABLE
        );
    }
    if (error.status === 503) {
        return new ApikitException(
            "SERVICE_UNAVAILABLE",
            "Service indisponible.",
            ErrorCategory.SERVER_UNAVAILABLE
        );
    }
    if (error.status === 504) {
        return new ApikitException(
            "TIME_OUT",
            "Infrastructure ou communication .",
            ErrorCategory.SERVER_UNAVAILABLE
        );
    }



    //------------------------------------------------
    // axios Erreur
    //------------------------------------------------
    const axiosError = error as AxiosError;

    //------------------------------------------------
    // action annuler
    //------------------------------------------------
    if (axios.isCancel(error)) {
        return new ApikitException(
            "REQUEST_CANCELLED",
            "Request cancelled",
            ErrorCategory.CANCELLED
        );
    }
    //------------------------------------------------
    // Erreur réseau : axios pas de reponse
    //------------------------------------------------
    if (!axiosError.response) {

        const  defaultError : ErrorDefinition= {
            code: "UNKNOWN_NETWORK_ERROR",
            message: axiosError.message,
        };
        const mapped : ErrorDefinition = getMappedError(
            AxiosErrorMapper,
            axiosError.code,
            defaultError
        );

        return new ApikitException(
            mapped.code,
            mapped.message,
            ErrorCategory.TECHNICAL
        );
    }


    //------------------------------------------------
    // Erreur serveur :  axios response
    //------------------------------------------------
    const data = error.response?.data;
    if (!data?.error) {
        return new ApikitException(
            "INVALID_ERROR_CONTRACT",
            "data est absent du contrat d'erreur ",
            ErrorCategory.CONTRACT
        );
    }


    const code = data.error?.code ?? "UNKNOWN_ERROR_RESPONSE";
    const message = data.error?.message ?? "API Error";
    const category = errorClassifier(code);

    return  new ApikitException(
        code,
        message,
        category,
        data?.error?.details,
    );
};