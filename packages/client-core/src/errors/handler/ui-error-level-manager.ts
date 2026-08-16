import {ErrorLevelVisibility} from "../enum/ErrorLevelVisibility";

class UiErrorLevelManager {

    private level: ErrorLevelVisibility = ErrorLevelVisibility.PROD;

    set(level: ErrorLevelVisibility) {
        this.level = level;
    }

    get(): ErrorLevelVisibility {
        return this.level;
    }
}

export const UIErrorLevelRegistry = new UiErrorLevelManager();