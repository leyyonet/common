// noinspection JSUnusedGlobalSymbols
/**
 * Extended array class, ie: Clearable arrays
 * */
export class List<T> extends Array<T> {
    constructor(...items: Array<T>) {
        super(...items);
    }

    /**
     * Clears array items, to align all iteration repositories, like Set, Map etc
     * */
    clear() {
        this.splice(0, this.length);
    }

    /**
     * Deletes given item
     * */
    delete(value: T) {
        const index = this.indexOf(value);
        if (index >= 0) {
            this.splice(index, 1);
        }
    }
    /**
     * Deletes by given predicate
     * */
    deleteByLambda(predicate: Predicate<T>) {
        const index = this.findIndex(predicate);
        if (index >= 0) {
            this.splice(index, 1);
        }
    }

}
type Predicate<T> = (value: T, index?: number, arr?: Array<T>) => T;
