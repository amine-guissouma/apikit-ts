// ----------------------
import {ApikitException} from "../api/apikit-exception";
import {ErrorCategory} from "../errors/enum/ErrorCategory";

export interface ApikitExceptionHandlerOptions {
    error: unknown;
    onBusinessError?: (error: ApikitException) => void;
}
/**
 * Gère uniquement les exceptions produites par Apikit.
 *
 * Toute autre exception est repropagée afin de ne pas masquer
 * une erreur de programmation ou une erreur provenant d'un autre système.
 */

export function apikitExceptionHandler(options: ApikitExceptionHandlerOptions): void {

    if (!(options.error instanceof ApikitException)) {
        console.warn("Une exception non-Apikit a été transmise à apikitExceptionHandler.", options.error);
        throw options.error;
    }

    switch (options.error.errorType) {

        case ErrorCategory.BUSINESS:
            // Mise à jour de l'UI
            options.onBusinessError?.(options.error);
            return;

        case ErrorCategory.SERVER:
            // Déjà traité par request()
            return;
    }
}