import { ErrorCategory } from "../errors/enum/ErrorCategory";
import { ErrorDefinition } from "../http/mapper-error-tool";

export class ApikitException extends Error {

    code: string;
    errorType: ErrorCategory;
    details?: any;

    // Nouvelle utilisation
    constructor(
        definition: ErrorDefinition,
        details?: any,
    );

    // Ancienne utilisation — conservée temporairement
    constructor(
        code: string,
        message: string,
        errorType: ErrorCategory,
        details?: any,
    );

    constructor(
        definitionOrCode: ErrorDefinition | string,
        messageOrDetails?: string | any,
        errorType?: ErrorCategory,
        details?: any,
    ) {
        if (typeof definitionOrCode === "string") {

            // Ancienne signature
            super(messageOrDetails);

            this.code = definitionOrCode;
            this.errorType = errorType!;
            this.details = details;

        } else {

            // Nouvelle signature
            super(definitionOrCode.message);

            this.code = definitionOrCode.code;
            this.errorType = definitionOrCode.category;
            this.details = messageOrDetails;
        }

        this.name = "ApiException";

        Object.setPrototypeOf(
            this,
            ApikitException.prototype
        );
    }
}