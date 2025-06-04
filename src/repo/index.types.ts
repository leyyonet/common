import {Dict, InitLike, ShiftMain, ShiftSecure} from "../shared";
import {List} from "../to";

/**
 * Common Repository factory
 *
 * Purpose, unify all iteration based data in some place to track memory usage in your applications
 * */
export interface CommonRepoLike extends ShiftSecure<CommonRepoSecure> {
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

    // region list
    /**
     * Creates new list with given collection
     *
     * @param {Array<string>} names
     * @return {List<any>}
     * */
    newList<V>(...names: Array<string>): List<V>;

    /**
     * Returns a list by given collection
     *
     * @param {symbol} collection
     * @return {List<any>}
     *
     * Note:
     * If the list does not exist than it returns null
     * */
    getList<V>(collection: symbol): List<V>;

    // endregion list

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
     * @return {CommonRepoItem}
     * */
    detailItem(type: RepoType, collection?: symbol): CommonRepoItem;

    /**
     * Exports sizes of repositories by given type and collection
     *
     *
     * @param {RepoType?} type
     * @param {symbol?} collection
     * @return {CommonRepoDetail}
     * */
    details(type?: RepoType, collection?: symbol): CommonRepoDetail;
}

export type CommonRepoSecure = ShiftMain<CommonRepoLike> & InitLike;


/**
 * Repo size dictionary which in corresponding type
 * */
export type CommonRepoItem = Dict<number>;

/**
 * Repo export dictionary which includes items
 * */
export type CommonRepoDetail = Record<RepoType, CommonRepoItem>;
export type RepoType = 'array' | 'list' | 'map' | 'set' | 'record';
export type RepoLengthLambda = (obj: unknown) => number;
