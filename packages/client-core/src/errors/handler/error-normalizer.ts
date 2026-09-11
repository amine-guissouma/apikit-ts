import { ApikitException } from "../../exception/apikit-exception";
import { getMappedError} from "../../http/mapper-error-tool";
import { AxiosErrorMapper } from "../../http/axios/axios-error-mapper";
import { errorClassifier } from "../mapping/error-classifier";
import { HttpStatusMapper } from "../../http/status/http-status-mapper";
import { ApikitErrorValidator } from "../validator/apikit-error-validator";
import {ApikitErrorDefinitions} from "../definitions/apikit-error-definitions";


export const errorNormalizer = (
    error: unknown
): ApikitException => {

    const validator = new ApikitErrorValidator(error);

    //------------------------------------------------
    // [ERR-NORMALIZER-Apikit_Exception]
    // Déjà une exception Apikit
    //------------------------------------------------

    if (validator.isApikitException()) {
        return  validator.getApikitException();
    }

    //------------------------------------------------
    // [ERR-NORMALIZER-Zod_Error]
    // Erreur Zod
    //------------------------------------------------

    if (validator.isZodError()) {
        return new ApikitException(ApikitErrorDefinitions.APIKIT_ZOD_SCHEMA_INVALID,  validator.getZodError().issues);
    }

    //------------------------------------------------
    // [ERR-NORMALIZER-Not_Axios_Error]
    // Pas une erreur Axios
    //------------------------------------------------


    if (validator.isNotAxiosError()) {
        return new ApikitException(ApikitErrorDefinitions.APIKIT_UNKNOWN_ERROR);
    }

    //------------------------------------------------
    // Erreur Axios
    //------------------------------------------------

    const axiosError = validator.getAxiosError();
    const axiosValidator = validator.getAxiosErrorValidator();

    //------------------------------------------------
    // [ERR-NORMALIZER-Axios_No_Response]
    // Erreur réseau Axios sans réponse
    // ------------------------------------------------

    if (axiosValidator.hasNoResponse()) {
        const defaultError = axiosValidator.getDefaultNetworkError();
        return new ApikitException(getMappedError(AxiosErrorMapper, axiosError.code, defaultError));
    }

    //------------------------------------------------
    // [ERR-NORMALIZER-Axios_Http_Status]
    // Erreur HTTP avec un status connu
    //------------------------------------------------
    const status = axiosValidator.getStatus();
    if (status) {
        const mapped = HttpStatusMapper[status];
        if (mapped) {
            return new ApikitException(mapped );
        }
    }

    //------------------------------------------------
    // [ERR-NORMALIZER-Axios_No_Data]
    // Réponse Axios sans data
    //------------------------------------------------
    if (axiosValidator.hasNoData()) {
        return new ApikitException(ApikitErrorDefinitions.APIKIT_MISSING_RESPONSE_DATA_AXIOS);
    }

    //------------------------------------------------
    // [ERR-NORMALIZER-Axios_No_Error_Contract]
    // Error absent du contrat de réponse
    //------------------------------------------------

    if (axiosValidator.hasNoErrorContract()) {
        return new ApikitException(ApikitErrorDefinitions.APIKIT_INVALID_ERROR_CONTRACT);
    }

    //------------------------------------------------
    // [ERR-NORMALIZER-Api_Error_Response]
    // Réponse API contenant une erreur
    //------------------------------------------------

    const data = axiosValidator.getData()!;
    const code = data.error?.code;
    const message = data.error?.message;
    const errorCategory = code ? errorClassifier(code) : ApikitErrorDefinitions.APIKIT_UNKNOWN_ERROR_RESPONSE.category;

    return new ApikitException(
        code ?? ApikitErrorDefinitions.APIKIT_UNKNOWN_ERROR_RESPONSE.code,
        message ?? ApikitErrorDefinitions.APIKIT_UNKNOWN_ERROR_RESPONSE.message,
        errorCategory,
        data.error?.details
    );
};