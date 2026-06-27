import {ApikitException} from "../api/ApikitException";
import axios, {AxiosError} from "axios";
import {ErrorCategory} from "./ErrorCategory";
import {getMappedError} from "../axios/getAxiosError";
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
            ErrorCategory.GLOBAL
        );
    }

    const axiosError = error as AxiosError;

    //------------------------------------------------
    // Erreur réseau
    //------------------------------------------------

    if (!axiosError.response) {

        const mapped = getMappedError(
            AxiosErrorMap,
            axiosError.code,
            {
                code: "UNKNOWN_NETWORK_ERROR",
                message: axiosError.message,
            }
        );

        return new ApikitException(
            mapped.code,
            mapped.message,
            ErrorCategory.GLOBAL
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