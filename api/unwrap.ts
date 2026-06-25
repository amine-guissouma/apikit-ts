export type ApiResponse<T> = {
    success: boolean
    message: string
    data: T
    error?: {
        code: string
        message: string
        details?: any
    }
}

export const unwrap = <T>(response: ApiResponse<T>): T => {
    if (!response.success) {
        const err = response.error?.message || "API Error"
        throw new Error(err)
    }
    if (!("data" in response)) {
        throw new Error("Malformed API response")
    }
    return response.data
}