import {ApikitErrorResponse, ApikitResponse} from "./types";
import {ApikitException} from "./ApikitException";
import {ErrorCategory} from "../errors/ErrorCategory";
import {errorClassify} from "../errors/ErrorClassify";

export const unwrap = <T>(
    response: ApikitResponse<T>
): T => {
    //  --------------------------------------------
    // cas de d'erreur
    //  --------------------------------------------

    if (!response.success) {
        if (response.error === undefined||response.error ===null) {
            throw new ApikitException(
                "UNKNOWN_ERROR",
                "Malformed API error response 'error' not found ",
                ErrorCategory.SERVER_UNHANDLED,
            );
        }

        const error:ApikitErrorResponse = response.error;
        const code = error.code;
        throw new ApikitException(
            code,
            error.message ,
            errorClassify(code),
            error.details
        );
    }
    //  --------------------------------------------
    // cas de success
    //  --------------------------------------------

    if (!("data" in response)) {
        throw new ApikitException(
            'MALFORMED_API',
            "Malformed API response 'data' not found ",
            ErrorCategory.SERVER_UNHANDLED)
    }

    return response.data;
};