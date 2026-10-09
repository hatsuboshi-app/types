/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
type Result<S, F extends string = string> =
    | SuccessResult<S>
    | FailureResult<F>

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
export type SuccessResult<S> = {
    success: true,
    data: S
    error?: never
}

/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
export type FailureResult<F extends string> = {
    success: false,
    error: F
    message?: string
    data?: never
}

/**
 * TODO
 *
 * @group Utilities
 * @category Functions
 */
export function success<T>(data: T): SuccessResult<T> {
    return { success: true, data }
}

/**
 * TODO
 *
 * @group Utilities
 * @category Functions
 */
export function fail<F extends string>(error: F, message?: string): FailureResult<F> {
    return message === undefined
        ? { success: false, error }
        : { success: false, error, message }
}

export default Result
