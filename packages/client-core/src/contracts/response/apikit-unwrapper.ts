import {ApikitException} from "../../exception/apikit-exception";
import {ErrorCategory} from "../../errors/enum/ErrorCategory";
import {errorClassifier} from "../../errors/mapping/error-classifier";
import {ApikitBaseResponse, apikitBaseResponseSchema} from "./apikit-schema";
import {z} from "zod";


export const apikitUnwrapper = <T>(
    response: unknown
): T => {


    // --------------------------------------------
    // Validation contrat Apikit
    // --------------------------------------------
    const result: z.ZodSafeParseResult<ApikitBaseResponse> = apikitBaseResponseSchema.safeParse(response);


    if (!result.success) {
        throw new ApikitException(
            "APIKIT_RESPONSE_INVALID",
            "Invalid Apikit response format",
            ErrorCategory.CONTRACT,
            result.error.issues
        );
    }

    const apiResponse:ApikitBaseResponse = result.data;


    // --------------------------------------------
    // Cas erreur API
    // --------------------------------------------

    if (!apiResponse.success) {
        if (!apiResponse.error) {
            throw new ApikitException(
                "APKIT_ERROR_MALFORMED",
                "Malformed API error response",
                ErrorCategory.CONTRACT
            );
        }
        throw new ApikitException(
            apiResponse.error.code,
            apiResponse.error.message,
            errorClassifier(apiResponse.error.code),
            apiResponse.error.details
        );
    }

    // --------------------------------------------
    // Cas succès
    // --------------------------------------------
    if (!("data" in apiResponse)) {
        throw new ApikitException(
            "APIKIT_DATA_MISSING",
            "Successful API response has no data",
            ErrorCategory.CONTRACT
        );
    }

    return apiResponse.data as T;
};