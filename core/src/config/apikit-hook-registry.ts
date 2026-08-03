import {ApikitHooks} from "./apikit-hooks";

class HookRegistry {
    private hooks:ApikitHooks = {};

    set(hooks:ApikitHooks){
        this.hooks = {...this.hooks, ...hooks};
    }

    get():ApikitHooks{
        return this.hooks;
    }

}


export const ApikitHookRegistry = new HookRegistry();