import {ErrorLevelVisibility} from "../errors/enum/ErrorLevelVisibility";
import {UiErrorConfig, UIErrorConfigRegistry} from "../errors/handler/ui-config-registry";
import {ErrorCategory} from "../errors/enum/ErrorCategory";
import {UIErrorLevelRegistry} from "../errors/handler/ui-error-level-manager";
import {BusinessErrorRegistry} from "../errors/mapping/business-error-codes";
import {ApikitHooks} from "./apikit-hooks";
import {ApikitHookRegistry} from "./apikit-hook-registry";

export interface ApikitConfig {


    visibility?: ErrorLevelVisibility;

    ui?: UiErrorConfig;

    businessErrors?: Record<string, ErrorCategory>;

    hooks?: ApikitHooks;
}


export function configureApikit(config: ApikitConfig): void {


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