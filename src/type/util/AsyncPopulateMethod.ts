type AsyncPopulateMethod<T> = (id: string) => Promise<T>

export default AsyncPopulateMethod