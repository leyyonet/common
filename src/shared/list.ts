// noinspection JSUnusedGlobalSymbols
/**
 * Extended array class, ie: Clearable arrays
 * */
export class List<T> extends Array<T> {

    /**
     * Clears array items, to align all iteration repositories, like Set, Map etc
     * */
    clear() {
        this.splice(0, this.length);
    }
}