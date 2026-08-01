// ----------------------
import {ApikitException} from "../api/apikit-exception";
import {ErrorCategory} from "../errors/enum/ErrorCategory";
import {handleGlobalError} from "../errors/error-handler";

export interface ApikitExceptionHandlerOptions {
    error: unknown;
    onBusinessError?: (error: ApikitException) => void;
    onAuthorizationError?: (error: ApikitException) => void;
}
/**
 * Gère uniquement les exceptions produites par Apikit.
 *
 * Toute autre exception est repropagée afin de ne pas masquer
 * une erreur de programmation ou une erreur provenant d'un autre système.
 */

export function apikitExceptionHandler(options: ApikitExceptionHandlerOptions): void {

    const error = options.error;

    if (!(error instanceof ApikitException)) {
        console.warn("Une exception non-Apikit a été transmise à apikitExceptionHandler.", error);
        throw error;
    }

    switch (error.errorType) {

        case ErrorCategory.BUSINESS:
            // Mise à jour de l'UI
            options.onBusinessError?.(error);
            return;


        case ErrorCategory.AUTHORIZATION:

            if(options.onAuthorizationError){
                options.onAuthorizationError(error);
            }
            // comportement par défaut ApiKit
            handleGlobalError(error);
            return;


        case ErrorCategory.AUTHENTICATION:

            // normalement déjà géré par apikitRequest
            handleGlobalError(error);
            return;

        default:
            return;
        // Déjà traité par request()

    }
}