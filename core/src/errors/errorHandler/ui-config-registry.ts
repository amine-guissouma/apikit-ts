import {ApikitException} from "../../api/apikit-exception";
import {ErrorLevelVisibility} from "../enum/ErrorLevelVisibility";

export type ErrorCallback = (error: ApikitException) => void;

export interface UiErrorConfig {
    dev?: ErrorCallback;
    integ?: ErrorCallback;
    qual?: ErrorCallback;
    prod?: ErrorCallback;
}


class UIErrorConfigManager {

    private config: UiErrorConfig = {};

    set(config: UiErrorConfig) {
        this.config = config;
    }

    get(level: ErrorLevelVisibility): ErrorCallback | undefined {

        switch (level) {
            case ErrorLevelVisibility.DEV:
                return this.config.dev;

            case ErrorLevelVisibility.INTEG:
                return this.config.integ;

            case ErrorLevelVisibility.QUAL:
                return this.config.qual;

            case ErrorLevelVisibility.PROD:
                return this.config.prod;

            default:
                return undefined;
        }
    }
}

export const UIErrorConfigRegistry = new UIErrorConfigManager();


