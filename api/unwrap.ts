import { ApikitResponse } from "./types";
import {ApikitException} from "./ApikitException";
import {ErrorCategory} from "../errors/ErrorCategory";

export const unwrap = <T>(
    response: ApikitResponse<T>
): T => {

    if (!response.success) {
        throw new ApikitException(
            response.error?.code ?? "UNKNOWN_ERROR",
            response.error?.message ?? "API Error",
            ErrorCategory.GLOBAL,
            response.error?.details
        );
    }

    if (!("data" in response)) {
        throw new ApikitException(
            'MALFORMED_API',
            "Malformed API response 'data' not found ",
            ErrorCategory.GLOBAL)
    }

    return response.data;
};