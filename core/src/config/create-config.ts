import {ErrorLevelVisibility} from "../errors/enum/ErrorLevelVisibility";
import {UiErrorConfig, UIErrorConfigRegistry} from "../errors/errorHandler/ui-config-registry";
import {ErrorCategory} from "../errors/enum/ErrorCategory";
import {UIErrorLevelRegistry} from "../errors/errorHandler/ui-error-level-manager";
import {BusinessErrorRegistry} from "../errors/business-error-codes";
import {ApikitHooks} from "./apikit-hooks";
import {ApikitHookRegistry} from "./apikit-hook-registry";

export interface ApikitConfig {

    baseURL?: string;

    visibility?: ErrorLevelVisibility;

    ui?: UiErrorConfig;

    businessErrors?: Record<string, ErrorCategory>;

    hooks?: ApikitHooks;
}


export function configureApikit(config: ApikitConfig): void {

    if (config.baseURL) {
        // todo faire un registre api.defaults.baseURL = config.baseURL;
    }
    if (config.visibility) {
        UIErrorLevelRegistry.set(config.visibility);
    }

    if (config.ui) {
        UIErrorConfigRegistry.set(config.ui);
    }

    if (config.businessErrors) {
        BusinessErrorRegistry.set(config.businessErrors);
    }

    if(config.hooks){
        ApikitHookRegistry.set(config.hooks);
    }
}