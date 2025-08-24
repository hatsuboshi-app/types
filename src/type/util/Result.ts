type Result<T> = SuccessResult<T> | FailureResult

type SuccessResult<T> = {
    status: "success",
    data: T
}

type FailureResult = {
    status: "failure",
    message?: string
}

export function success<T>(value: T): SuccessResult<T> {
    return {
        status: "success",
        data: value
    }
}

export function fail(message?: string): FailureResult {
    return {
        status: "failure",
        message: message
    }
}

export default Result
