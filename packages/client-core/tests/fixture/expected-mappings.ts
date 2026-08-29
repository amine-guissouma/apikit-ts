import {AxiosError} from "axios";
import {ErrorCategory} from "../../src/errors/enum/ErrorCategory";


export const expectedAxiosCodeCategory: [string, ErrorCategory][] = [
    [AxiosError.ERR_NETWORK, ErrorCategory.TECHNICAL],
    [AxiosError.ECONNREFUSED, ErrorCategory.TECHNICAL],
    [AxiosError.ECONNABORTED, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_CANCELED, ErrorCategory.CANCELLED],
    [AxiosError.ERR_INVALID_URL, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_BAD_REQUEST, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_BAD_RESPONSE, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_FR_TOO_MANY_REDIRECTS, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_NOT_SUPPORT, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_DEPRECATED, ErrorCategory.TECHNICAL],
    [AxiosError.ETIMEDOUT, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_BAD_OPTION, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_BAD_OPTION_VALUE, ErrorCategory.TECHNICAL],
    [AxiosError.ERR_FORM_DATA_DEPTH_EXCEEDED, ErrorCategory.TECHNICAL],
];

export const expectedAxiosCodes = expectedAxiosCodeCategory.map(
    ([code]) => code
);

export const expectedHttpStatusCategory: [number, ErrorCategory][] = [
    [401, ErrorCategory.AUTHENTICATION],
    [403, ErrorCategory.AUTHORIZATION],
    [500, ErrorCategory.SERVER_UNEXPECTED],
    [502, ErrorCategory.SERVER_UNAVAILABLE],
    [503, ErrorCategory.SERVER_UNAVAILABLE],
    [504, ErrorCategory.SERVER_UNAVAILABLE],
];
export const expectedHttpStatus = expectedHttpStatusCategory.map(
    ([status]) => status
);

export const expectedApikitErrorCodeCategory :[string, ErrorCategory][] =
    [
    ["APIKIT_ZOD_SCHEMA_INVALID", ErrorCategory.CONTRACT],
    ["APIKIT_UNKNOWN_ERROR", ErrorCategory.UNEXPECTED],
    ["APIKIT_MISSING_RESPONSE_DATA_AXIOS", ErrorCategory.CONTRACT],
    ["APIKIT_INVALID_ERROR_CONTRACT", ErrorCategory.CONTRACT],
    ["APIKIT_UNKNOWN_ERROR_RESPONSE", ErrorCategory.SERVER],
    ["APIKIT_AXIOS_NETWORK_UNKNOWN_ERROR", ErrorCategory.TECHNICAL],
    ["APIKIT_UNKNOWN_CODE_ERROR", ErrorCategory.UNEXPECTED],
    ["APIKIT_RESPONSE_INVALID", ErrorCategory.CONTRACT],
    ["APIKIT_ERROR_MALFORMED", ErrorCategory.CONTRACT],
    ["APIKIT_DATA_MISSING", ErrorCategory.CONTRACT],
]
export const expectedApikitErrorCodes = expectedApikitErrorCodeCategory.map(
    ([code]) => code
);