import {ApikitException} from "../../exception/apikit-exception";
import {errorClassifier} from "../../errors/mapping/error-classifier";
import {ApikitBaseResponse, apikitBaseResponseSchema} from "./apikit-schema";
import {z} from "zod";
import {ApikitErrorDefinitions} from "../../errors/definitions/apikit-error-definitions";


export const apikitUnwrapper = <T>(
    response: unknown
): T => {

    // --------------------------------------------
    // [RESPONSE-UNWRAPPER-Invalid_Apikit_Response]
    // Validation du contrat Apikit
    // --------------------------------------------
    const result: z.ZodSafeParseResult<ApikitBaseResponse> = apikitBaseResponseSchema.safeParse(response);

    if (!result.success) {
        throw new ApikitException(ApikitErrorDefinitions.APIKIT_RESPONSE_INVALID, result.error.issues);
    }

    const apiResponse:ApikitBaseResponse = result.data;


    // --------------------------------------------
    // Cas erreur API
    // --------------------------------------------
    if (!apiResponse.success) {
        // --------------------------------------------
        // [RESPONSE-UNWRAPPER-Missing_Error_Contract]
        // Contrat d'erreur incomplet
        // --------------------------------------------
        if (!apiResponse.error) {
            throw new ApikitException(ApikitErrorDefinitions.APIKIT_ERROR_MALFORMED);
        }
        // --------------------------------------------
        // [RESPONSE-UNWRAPPER-Api_Error_Response]
        // Erreur API valide
        // --------------------------------------------
        const error = apiResponse.error;
        throw new ApikitException(error.code, error.message, errorClassifier(error.code), error.details);
    }

    // --------------------------------------------
    // [RESPONSE-UNWRAPPER-Missing_Data]
    // Réponse succès sans data
    // --------------------------------------------
    if (!("data" in apiResponse)) {
        throw new ApikitException(ApikitErrorDefinitions.APIKIT_DATA_MISSING);
    }

    // --------------------------------------------
    // [RESPONSE-UNWRAPPER-Success_Response]
    // Réponse succès avec data
    // --------------------------------------------
    return apiResponse.data as T;
};