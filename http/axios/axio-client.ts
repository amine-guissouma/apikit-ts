import axios, {AxiosInstance} from "axios"
import {BASE_URL} from "../../apikit-config";

export const api:AxiosInstance = axios.create({
    baseURL: BASE_URL,
})