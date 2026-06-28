import {ApikitException} from "../api/ApikitException";
import axios, {AxiosError} from "axios";
import {ErrorCategory} from "./ErrorCategory";
import {ErrorDefinition, getMappedError} from "../axios/getAxiosError";
import {AxiosErrorMap} from "../axios/AxiosErrorMap";
import {errorClassify} from "./ErrorClassify";

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

    if (!axios.isAxiosError(error)) {
        return new ApikitException(
            "UNKNOWN_ERROR",
            "Une erreur inattendue est survenue.",
            ErrorCategory.SERVER_UNHANDLED
        );
    }

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
            AxiosErrorMap,
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
    // Réponse du serveur
    //------------------------------------------------

    const data = error.response?.data;
    const code = data?.error?.code ?? "UNKNOWN_ERROR";
    const message = data?.error?.message ?? "API Error";
    const category = errorClassify(code);

    return  new ApikitException(
        code,
        message,
        category,
        data?.error?.details,

    );
};