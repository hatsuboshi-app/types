/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
type Result<T> = SuccessResult<T> | FailureResult

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
export type SuccessResult<T> = {
    success: true,
    data: T
}

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
export type FailureResult = {
    success: false,
    message?: string
}

/**
 * TODO
 *
 * @group Utilities
 * @category Functions
 */
export function success<T>(value: T): SuccessResult<T> {
    return {
        success: true,
        data: value
    }
}

/**
 * TODO
 *
 * @group Utilities
 * @category Functions
 */
export function fail(message?: string): FailureResult {
    return {
        success: false,
        message: message
    }
}

export default Result
