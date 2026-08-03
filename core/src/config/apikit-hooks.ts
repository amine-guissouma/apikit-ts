import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApikitException } from "../api/apikit-exception";


export type BeforeRequestHook =
    (
        request: AxiosRequestConfig
    ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;


export type AfterResponseHook =
    (
        response: AxiosResponse
    ) => AxiosResponse | Promise<AxiosResponse>;


export type OnErrorHook =
    (
        error: ApikitException
    ) => ApikitException | Promise<ApikitException>;



export interface ApikitHooks {

    beforeRequest?: BeforeRequestHook[];

    afterResponse?: AfterResponseHook[];

    onError?: OnErrorHook[];

}