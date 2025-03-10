import {List} from "./list";
import {CommonStorage, CommonStorageSecure, StorageDetail, StorageItem, StorageType} from "./index-types";
import {Leyyo} from "../leyyo";

// noinspection JSUnusedLocalSymbols
/** @inheritDoc */
export class CommonStorageImpl implements CommonStorage, CommonStorageSecure {
    private readonly _lists: Map<string, List<any>>;
    private readonly _arrays: Map<string, Array<any>>;
    private readonly _maps: Map<string, Map<string, any>>;
    private readonly _sets: Map<string, Set<any>>;

    /**
     * Default constructor
     *
     * Responsibilities
     * - Create repositories => ie: lists, arrays, maps, sets
     * */
    constructor() {
        this._lists = new Map<string, List<any>>();
        this._arrays = new Map<string, Array<any>>();
        this._maps = new Map<string, Map<string, any>>();
        this._sets = new Map<string, Set<any>>();
    }
    $init(leyyo: Leyyo): void {

    }

    /**
     * Get sizes of each repository by given type and name (optional)
     *
     * @param {StorageType} type
     * @param {string?} name
     * @return {StorageItem}
     * */
    protected detailItem(type: StorageType, name?: string): StorageItem {
        const result = {} as StorageItem;
        switch (type) {
            case "array":
                if (name) {
                    if (this._arrays.has(name)) {
                        return {[name]: this._arrays.get(name).length} as StorageItem;
                    }
                    return {[name]: -1} as StorageItem;
                }
                for (const [key, list] of this._arrays.entries()) {
                    result[key] = list.length;
                }
                return result;
            case "list":
                if (name) {
                    if (this._lists.has(name)) {
                        return {[name]: this._lists.get(name).length} as StorageItem;
                    }
                    return {[name]: -1} as StorageItem;
                }
                for (const [key, list] of this._lists.entries()) {
                    result[key] = list.length;
                }
                return result;
            case "map":
                if (name) {
                    if (this._maps.has(name)) {
                        return {[name]: this._maps.get(name).size} as StorageItem;
                    }
                    return {[name]: -1} as StorageItem;
                }
                for (const [key, map] of this._maps.entries()) {
                    result[key] = map.size;
                }
                return result;
            case "set":
                if (name) {
                    if (this._sets.has(name)) {
                        return {[name]: this._sets.get(name).size} as StorageItem;
                    }
                    return {[name]: -1} as StorageItem;
                }
                for (const [key, set] of this._sets.entries()) {
                    result[key] = set.size;
                }
                return result;
            default:
                return {[name]: -1} as StorageItem;
        }
    }

    // region list
    /** @inheritDoc */
    newList<V>(name: string): List<V> {
        const list = new List<V>();
        this._lists.set(name, list);
        return list;
    }

    /** @inheritDoc */
    getList<V>(name: string): List<V> {
        return this._lists.get(name);
    }
    // endregion list

    // region array
    /** @inheritDoc */
    newArray<V>(name: string): Array<V> {
        const arr = [];
        this._arrays.set(name, arr);
        return arr;
    }

    /** @inheritDoc */
    getArray<V>(name: string): Array<V> {
        return this._arrays.get(name);
    }

    // endregion array

    // region map
    /** @inheritDoc */
    newMap<V>(name: string): Map<string, V> {
        const map = new Map<string, V>;
        this._maps.set(name, map);
        return map;
    }

    /** @inheritDoc */
    getMap<V>(name: string): Map<string, V> {
        return this._maps.get(name);
    }
    // endregion map

    // region set
    /** @inheritDoc */
    newSet<V>(name: string): Set<V> {
        const set = new Set<V>;
        this._sets.set(name, set);
        return set;
    }

    /** @inheritDoc */
    getSet<V>(name: string): Set<V> {
        return this._sets.get(name);
    }
    // endregion set


    /** @inheritDoc */
    details(type?: StorageType, name?: string): StorageDetail {
        const result = {} as StorageDetail;
        if (type) {
            result[type] = this.detailItem(type, name);
            return result;
        }
        else {
            result['array'] = this.detailItem('array', name);
            result['list'] = this.detailItem('list', name);
            result['map'] = this.detailItem('map', name);
            result['set'] = this.detailItem('set', name);
            return result;
        }
    }

    get $back(): CommonStorage {
        return this;
    }

    get $secure(): CommonStorageSecure {
        return this;
    }
}