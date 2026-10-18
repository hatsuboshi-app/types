/**
 * Pagination query parameters for listing any resource.
 */
export interface PageQuery {
    /**
     * The page number to retrieve. (1-indexed)
     *
     * @isInt
     * @minimum 1
     */
    p?:  number

    /**
     * The number of results to return per page.
     *
     * @isInt
     * @minimum 1
     * @maximum 100
     */
    pp?: number
}