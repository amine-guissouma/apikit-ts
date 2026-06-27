import {ErrorCategory} from "../errors/ErrorCategory";

export class ApikitException extends Error {
    code: string;
    errorType:ErrorCategory;
    details?: any;
    constructor(
        code: string,
        message: string,
        errorType :ErrorCategory,
        details?: any,
    ) {
        super(message);

        this.name = "ApiException";
        this.code = code;
        this.errorType = errorType;
        this.details = details;
    }
}
