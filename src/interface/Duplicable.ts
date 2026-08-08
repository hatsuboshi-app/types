interface Duplicable {
    /**
     * Returns a deep copy of this instance.
     */
    copy(): Duplicable
}

export default Duplicable