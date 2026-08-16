import { ErrorCategory } from "../enum/ErrorCategory";
import {BusinessErrorRegistry} from "./business-error-codes";

export const errorClassifier = (code?: string): ErrorCategory => {

    if (!code) {
        return ErrorCategory.SERVER;
    }
    const category = BusinessErrorRegistry.getCategory(code);
    if (category) {
        return category;
    }
    return ErrorCategory.SERVER;
};