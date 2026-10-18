/**
 * Query parameters for searching objects with a `name`.
 */
export interface SimpleNameQuery {
    /**
     * Match objects whose name / label contains this string (case-insensitive).
     *
     * @maxLength 200
     */
    q?: string
}