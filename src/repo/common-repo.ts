import {CommonRepoLike, CommonRepoSecure, CommonRepoDetail, CommonRepoItem} from "./index.types";
import {LeyyoCommonHook, LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import {RepoType, RepoTypeItems} from "./repo-type";
import {List} from "../to";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
/** @inheritDoc */
export class CommonRepo implements CommonRepoLike, CommonRepoSecure {
    private readonly _lists: Map<symbol, List<any>>;
    private readonly _arrays: Map<symbol, Array<any>>;
    private readonly _maps: Map<symbol, Map<any, any>>;
    private readonly _sets: Map<symbol, Set<any>>;
    private lyy: LeyyoLike;

    /**
     * Default constructor
     *
     * Responsibilities
     * - Create repositories => ie: lists, arrays, maps, sets
     * */
    constructor() {
        this._lists = new Map<symbol, List<any>>();
        this._arrays = new Map<symbol, Array<any>>();
        this._maps = new Map<symbol, Map<string, any>>();
        this._sets = new Map<symbol, Set<any>>();
    }

    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;

        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonRepo, 'class', FQN);
        }).$lazyRun(() => {
            const enumMap = {
                RepoType: RepoTypeItems,
            };
            for (const [name, value] of Object.entries(enumMap)) {
                this.lyy.fqn.register(name, value, 'enum', FQN);
                this.lyy.hook.queueForCallback(LeyyoCommonHook.enumPendingRegister, value);
            }
        });
    }

    private _appendDetail(result: CommonRepoItem, collection: symbol, size: number, duplicated: number): number {
        if (result[collection.description] === undefined) {
            result[collection.description] = size;
            return duplicated;
        }
        duplicated++;
        result[collection.description + '##' + duplicated] = size;
        return duplicated;
    }

    // region list
    /** @inheritDoc */
    newList<V>(...names: Array<string>): List<V> {
        const list = new List<V>();
        this._lists.set(this.lyy.descriptor.sym(...names), list);
        return list;
    }

    /** @inheritDoc */
    getList<V>(collection: symbol): List<V> {
        return this._lists.get(collection);
    }

    // endregion list

    // region array
    /** @inheritDoc */
    newArray<V>(...names: Array<string>): Array<V> {
        const arr = [];
        this._arrays.set(this.lyy.descriptor.sym(...names), arr);
        return arr;
    }

    /** @inheritDoc */
    getArray<V>(collection: symbol): Array<V> {
        return this._arrays.get(collection);
    }

    // endregion array

    // region map
    /** @inheritDoc */
    newMap<K, V>(...names: Array<string>): Map<K, V> {
        const map = new Map<K, V>;
        this._maps.set(this.lyy.descriptor.sym(...names), map);
        return map;
    }

    /** @inheritDoc */
    getMap<K, V>(collection: symbol): Map<K, V> {
        return this._maps.get(collection);
    }

    // endregion map

    // region set
    /** @inheritDoc */
    newSet<V>(...names: Array<string>): Set<V> {
        const set = new Set<V>;
        this._sets.set(this.lyy.descriptor.sym(...names), set);
        return set;
    }

    /** @inheritDoc */
    getSet<V>(collection: symbol): Set<V> {
        return this._sets.get(collection);
    }

    // endregion set


    // region detail
    /** @inheritDoc */
    detailItem(type: RepoType, collection?: symbol): CommonRepoItem {
        const result = {} as CommonRepoItem;
        let duplicated = 0;
        switch (type) {
            case "array":
                if (collection) {
                    if (this._arrays.has(collection)) {
                        return {[collection.description]: this._arrays.get(collection).length} as CommonRepoItem;
                    }
                    return {[collection.description]: -1} as CommonRepoItem;
                }
                for (const [key, list] of this._arrays.entries()) {
                    duplicated = this._appendDetail(result, key, list.length, duplicated);
                }
                return result;
            case "list":
                if (collection) {
                    if (this._lists.has(collection)) {
                        return {[collection.description]: this._lists.get(collection).length} as CommonRepoItem;
                    }
                    return {[collection.description]: -1} as CommonRepoItem;
                }
                for (const [key, list] of this._lists.entries()) {
                    duplicated = this._appendDetail(result, key, list.length, duplicated);
                }
                return result;
            case "map":
                if (collection) {
                    if (this._maps.has(collection)) {
                        return {[collection.description]: this._maps.get(collection).size} as CommonRepoItem;
                    }
                    return {[collection.description]: -1} as CommonRepoItem;
                }
                for (const [key, map] of this._maps.entries()) {
                    duplicated = this._appendDetail(result, key, map.size, duplicated);
                }
                return result;
            case "set":
                if (collection) {
                    if (this._sets.has(collection)) {
                        return {[collection.description]: this._sets.get(collection).size} as CommonRepoItem;
                    }
                    return {[collection.description]: -1} as CommonRepoItem;
                }
                for (const [key, set] of this._sets.entries()) {
                    duplicated = this._appendDetail(result, key, set.size, duplicated);
                }
                return result;
            default:
                if (collection) {
                    return {[collection.description]: -1} as CommonRepoItem;
                }
                return {['*']: -1} as CommonRepoItem;
        }
    }

    /** @inheritDoc */
    details(type?: RepoType, collection?: symbol): CommonRepoDetail {
        const result = {} as CommonRepoDetail;
        if (type) {
            result[type] = this.detailItem(type, collection);
            return result;
        } else {
            result['array'] = this.detailItem('array', collection);
            result['list'] = this.detailItem('list', collection);
            result['map'] = this.detailItem('map', collection);
            result['set'] = this.detailItem('set', collection);
            return result;
        }
    }
    // endregion detail

    get $back(): CommonRepoLike {
        return this;
    }

    get $secure(): CommonRepoSecure {
        return this;
    }
}
