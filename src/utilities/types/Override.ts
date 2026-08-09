/**
 * TODO
 *
 * @group Utilities
 * @category Types
 */
type Override<T, R extends Partial<Record<keyof T, unknown>>> = Omit<T, keyof R> & R

export default Override
