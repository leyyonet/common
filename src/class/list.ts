import {ListLike, ListPredicate} from "./index.types.js";

/**
 * Extended array class, ie: Clearable arrays
 * */
export class List<T = unknown> extends Array<T> implements ListLike<T> {
    constructor(...items: Array<T>) {
        super(...items);
    }

    /** @inheritDoc */
    clear(): number {
        const size = this.length;
        this.splice(0, this.length);
        return size;
    }

    /** @inheritDoc */
    delete(value: T): boolean {
        const index = this.indexOf(value);
        if (index >= 0) {
            this.splice(index, 1);
            return true;
        }
        return false;
    }

    /** @inheritDoc */
    deleteByLambda(predicate: ListPredicate<T>): boolean {
        const index = this.findIndex(predicate);
        if (index >= 0) {
            this.splice(index, 1);
            return true;
        }
        return false;
    }
}
