import type {Dict, InitLike, ShiftMain, ShiftSecure} from "../shared";

/**
 * Common Repository factory
 *
 * Purpose, unify all iteration based data in some place to track memory usage in your applications
 * */
export interface RepoCommonLike extends ShiftSecure<RepoCommonSecure> {
    // region array
    /**
     * Creates new array with given collection
     *
     * @param {Array<string>} names
     * @return {Array<any>}
     * */
    newArray<V>(...names: Array<string>): Array<V>;

    /**
     * Returns an array by given collection
     *
     * @param {symbol} collection
     * @return {Array<any>}
     *
     * Note:
     * If the array does not exist than it returns null
     * */
    getArray<V>(collection: symbol): Array<V>;

    // endregion array

    // region map
    /**
     * Creates new map with given collection
     *
     * @param {Array<string>} names
     * @return {Map<any, any>}
     * */
    newMap<K, V>(...names: Array<string>): Map<K, V>;


    /**
     * Returns a map by given collection
     *
     * @param {symbol} collection
     * @return {Map<any, any>}
     *
     * Note:
     * If the map does not exist than it returns null
     * */
    getMap<K, V>(collection: symbol): Map<K, V>;

    // endregion map

    // region set
    /**
     * Creates new set with given collection
     *
     * @param {Array<string>} names
     * @return {Set<any>}
     * */
    newSet<V>(...names: Array<string>): Set<V>;

    /**
     * Returns a set by given collection
     *
     * @param {symbol} collection
     * @return {Set<any>}
     *
     * Note:
     * If the set does not exist than it returns null
     * */
    getSet<V>(collection: symbol): Set<V>;

    // endregion set

    // region record
    /**
     * Creates new record with given collection
     *
     * @param {Array<string>} names
     * @return {Record<any, any>}
     * */
    newRecord<K extends string|symbol, V>(...names: Array<string>): Record<K, V>;


    /**
     * Returns a record by given collection
     *
     * @param {symbol} collection
     * @return {Record<any, any>}
     *
     * Note:
     * If the record does not exist than it returns null
     * */
    getRecord<K extends string|symbol, V>(collection: symbol): Record<K, V>;

    // endregion map

    /**
     * Get sizes of each repository by given type and collection (optional)
     *
     * @param {RepoType} type
     * @param {symbol?} collection
     * @return {RepoItem}
     * */
    detailItem(type: RepoType, collection?: symbol): RepoItem;

    /**
     * Exports sizes of repositories by given type and collection
     *
     *
     * @param {RepoType?} type
     * @param {symbol?} collection
     * @return {RepoDetail}
     * */
    details(type?: RepoType, collection?: symbol): RepoDetail;
}

export type RepoCommonSecure = ShiftMain<RepoCommonLike> & InitLike;


/**
 * Repo size dictionary which in corresponding type
 * */
export type RepoItem = Dict<number>;

/**
 * Repo export dictionary which includes items
 * */
export type RepoDetail = Record<RepoType, RepoItem>;
export type RepoType = 'array' | 'map' | 'set' | 'record';
export type RepoLengthLambda = (obj: unknown) => number;
