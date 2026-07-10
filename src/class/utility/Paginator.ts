import Nullable from "../../type/utility/Nullable"
import JSONSerializable from "../../interface/JSONSerializable"

export default class Paginator<K extends T & JSONSerializable<T>, T extends {}> implements IPaginator<T>, JSONSerializable<IPaginator<T>> {
    readonly data: K[]
    readonly meta: {
        currentPage: number,
        pageSize: number,
        totalItems: number,
        totalPages: number,
        prevPageLocation: Nullable<string>,
        nextPageLocation: Nullable<string>
    }

    constructor(type: (new(obj: T) => K))
    constructor(type: (new(obj: T) => K), obj: Partial<IPaginator<T>>)
    constructor(type: (new(obj: T) => K), obj?: Partial<IPaginator<T>>) {
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
            prevPageLocation: obj?.meta?.prevPageLocation ?? null,
            nextPageLocation: obj?.meta?.nextPageLocation ?? null
        }
        this.meta.totalPages = obj?.meta?.totalPages ?? Math.ceil(this.meta.totalItems / this.meta.pageSize)
    }

    toJSON(): IPaginator<T> {
        return {
            data: this.data.map(d => d.toJSON()),
            meta: this.meta
        }
    }
}

export interface IPaginator<T extends {}> {
    data: T[]
    meta: {
        currentPage: number,
        pageSize: number,
        totalItems: number,
        totalPages: number,
        prevPageLocation: Nullable<string>,
        nextPageLocation: Nullable<string>
    }
}