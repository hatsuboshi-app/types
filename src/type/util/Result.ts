type Result<T> = SuccessResult<T> | FailureResult

export type SuccessResult<T> = {
    success: true,
    data: T
}

export type FailureResult = {
    success: false,
    message?: string
}

export function success<T>(value: T): SuccessResult<T> {
    return {
        success: true,
        data: value
    }
}

export function fail(message?: string): FailureResult {
    return {
        success: false,
        message: message
    }
}

export default Result
