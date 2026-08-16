import {ApikitException} from "../../exception/apikit-exception";
import axios, {AxiosError} from "axios";
import {ErrorCategory} from "../enum/ErrorCategory";
import {ErrorDefinition, getMappedError} from "../../http/mapper-error-tool";
import {AxiosErrorMapper} from "../../http/axios/axios-error-mapper";
import {errorClassifier} from "../mapping/error-classifier";
import {ZodError} from "zod";
import {HttpStatusMapper} from "../../http/status/http-status-mapper";


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
            "APIKIT_ZOD_SCHEMA_INVALID",
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
            "APIKIT_UNKNOWN_ERROR",
            "Une erreur service non controler.",
            ErrorCategory.UNEXPECTED
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

        const defaultError: ErrorDefinition = {
            code: "APIKIT_AXIOS_NETWORK_UNKNOWN_ERROR",
            message: axiosError.message,
            category: ErrorCategory.TECHNICAL
        };

        const mapped : ErrorDefinition = getMappedError(
            AxiosErrorMapper,
            axiosError.code,
            defaultError
        );

        return new ApikitException(
            mapped.code,
            mapped.message,
            mapped.category
        );
    }

    // Http Status
    const status = error.response?.status;
    if (status) {
        const mapped = HttpStatusMapper[status];
        if (mapped) {
            return new ApikitException(
                mapped.code,
                mapped.message,
                mapped.category
            );
        }
    }

    //------------------------------------------------
    // Erreur serveur :  axios response
    //------------------------------------------------
    const data = error.response?.data;
    if (!data?.error) {
        return new ApikitException(
            "APIKIT_INVALID_ERROR_CONTRACT",
            "data est absent du contrat d'erreur",
            ErrorCategory.CONTRACT
        );
    }

    //------------------------------------------------
    // Erreur serveur :  axios response
    //------------------------------------------------
    const code = data.error?.code ?? "APIKIT_UNKNOWN_ERROR_RESPONSE";
    const message = data.error?.message ?? "API Error";
    const category = errorClassifier(code);

    return  new ApikitException(
        code,
        message,
        category,
        data?.error?.details,
    );
};