
export type ApikitErrorResponse = {
    code: string
    message: string
    details?: any
}

export type ApikitResponse<T> = {
    success: boolean
    message: string
    data: T
    error?: ApikitErrorResponse
}