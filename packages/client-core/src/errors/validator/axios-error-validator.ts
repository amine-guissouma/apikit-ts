import {AxiosError} from "axios";
import {ApikitResponse} from "../../contracts/response/apikit-types";
import {ErrorDefinition} from "../../http/mapper-error-tool";
import {ApikitErrorDefinitions} from "../definitions/apikit-error-definitions";

export class AxiosErrorValidator {

    constructor(
        private readonly error: AxiosError
    ) {}

    hasNoResponse(): boolean {
        return !this.error.response;
    }

    getStatus(): number | undefined {
        return this.error.response?.status;
    }

    hasNoData(): boolean {
        return !this.error.response?.data;
    }

    hasNoErrorContract(): boolean {

        const data = this.getData();

        return !!data && !data.error;
    }

    getData(): ApikitResponse<unknown> | undefined {

        return this.error.response?.data as
            | ApikitResponse<unknown>
            | undefined;
    }
    getDefaultNetworkError(): ErrorDefinition {
        return {
            ...ApikitErrorDefinitions.APIKIT_AXIOS_NETWORK_UNKNOWN_ERROR,
            message: this.error.message
        };
    }
}