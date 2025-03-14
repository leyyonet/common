import {InitLike, List, ShiftMain, ShiftSecure, StorageDetail} from "../shared";
import {StorageType} from "../literal";

/**
 * Storage factory
 *
 * Purpose, unify all iteration based data in some place to track memory usage in your applications
 * */
export interface CommonStorageLike extends ShiftSecure<CommonStorageSecure> {
    // region array
    /**
     * Creates new array
     *
     * @param {string} name
     * @return {Array<any>}
     * */
    newArray<V>(name: string): Array<V>;

    /**
     * Returns an array by given name
     *
     * @param {string} name
     * @return {Array<any>}
     *
     * Note:
     * If the array does not exist than it returns null
     * */
    getArray<V>(name: string): Array<V>;

    // endregion array

    // region list
    /**
     * Creates new list
     *
     * @param {string} name
     * @return {List<any>}
     * */
    newList<V>(name: string): List<V>;

    /**
     * Returns a list by given name
     *
     * @param {string} name
     * @return {List<any>}
     *
     * Note:
     * If the list does not exist than it returns null
     * */
    getList<V>(name: string): List<V>;

    // endregion list

    // region map
    /**
     * Creates new map
     *
     * @param {string} name
     * @return {Map<any, any>}
     * */
    newMap<V, K = string>(name: string): Map<K, V>;


    /**
     * Returns a map by given name
     *
     * @param {string} name
     * @return {Map<any, any>}
     *
     * Note:
     * If the map does not exist than it returns null
     * */
    getMap<V, K = string>(name: string): Map<K, V>;

    // endregion map

    // region set
    /**
     * Creates new set
     *
     * @param {string} name
     * @return {Set<any>}
     * */
    newSet<V>(name: string): Set<V>;

    /**
     * Returns a set by given name
     *
     * @param {string} name
     * @return {Set<any>}
     *
     * Note:
     * If the set does not exist than it returns null
     * */
    getSet<V>(name: string): Set<V>;

    // endregion set

    /**
     * Exports sizes of repositories by given type and name
     *
     *
     * @param {StorageType?} type
     * @param {string?} name
     * @return {StorageDetail}
     * */
    details(type?: StorageType, name?: string): StorageDetail;
}

export type CommonStorageSecure = ShiftMain<CommonStorageLike> & InitLike;