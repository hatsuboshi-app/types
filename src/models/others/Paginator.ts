import JSONSerializable from "../../utilities/interfaces/JSONSerializable"

/**
 * TODO
 *
 * @group Model Classes
 */
export default class Paginator<O extends I & JSONSerializable<I>, I extends {}> implements IPaginator<I>, JSONSerializable<IPaginator<I>> {
    readonly data: O[]
    readonly meta: {
        currentPage: number,
        pageSize: number,
        totalItems: number,
        totalPages: number
    }

    constructor(type: (new(obj: I) => O), obj?: Partial<IPaginator<I>>) {
        this.data = []
        if (obj?.data) {
            obj.data.forEach(v => {
                this.data.push(new type(v))
            })
        }
        this.meta = {
            currentPage: obj?.meta?.currentPage ?? 1,
            pageSize: obj?.meta?.pageSize ?? 15,
            totalItems: obj?.meta?.totalItems ?? this.data.length,
            totalPages: 0,  // updated later in constructor
        }
        this.meta.totalPages = obj?.meta?.totalPages ?? Math.ceil(this.meta.totalItems / this.meta.pageSize)
    }

    toJSON(): IPaginator<I> {
        return {
            data: this.data.map(d => d.toJSON()),
            meta: this.meta
        }
    }
}

/**
 * JSON-serializable representation of {@link Paginator}.
 *
 * @group Data Transfer Objects
 */
export interface IPaginator<T extends {}> {
    data: T[]
    meta: {
        currentPage: number,
        pageSize: number,
        totalItems: number,
        totalPages: number
    }
}
