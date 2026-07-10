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
    // erreur indefinie
    //------------------------------------------------
    if (!axios.isAxiosError(error)) {
        return new ApikitException(
            "UNKNOWN_ERROR",
            "Une erreur inattendue est survenue.",
            ErrorCategory.SERVER_UNHANDLED
        );
    }

    //------------------------------------------------
    // axios Erreur
    //------------------------------------------------
    const axiosError = error as AxiosError;
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
    const code = data?.error?.code ?? "UNKNOWN_ERROR_RESPONSE";
    const message = data?.error?.message ?? "API Error";
    const category = errorClassifier(code);

    return  new ApikitException(
        code,
        message,
        category,
        data?.error?.details,

    );
};