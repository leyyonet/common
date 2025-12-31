import {
    CommonRepoDetail,
    CommonRepoItem,
    CommonRepoLike,
    CommonRepoSecure,
    RepoLengthLambda,
    RepoType
} from "./index.types";
import {LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import {List} from "../to";
import {Arr} from "../shared";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
/** @inheritDoc */
export class CommonRepo implements CommonRepoLike, CommonRepoSecure {
    private readonly _lists = new Map<symbol, List<unknown>>();
    private readonly _arrays = new Map<symbol, Array<unknown>>();
    private readonly _maps = new Map<symbol, Map<unknown, unknown>>();
    private readonly _sets = new Map<symbol, Set<unknown>>();
    private readonly _records = new Map<symbol, Record<string|symbol, unknown>>();

    /**
     * Default constructor
     *
     * Responsibilities
     * - Create repositories => ie: lists, arrays, maps, sets
     * */
    constructor(private lyy: LeyyoLike) {
    }

    $init(): void {

        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonRepo, 'class', FQN);
        });
    }

    private _addDetail(map: Map<any, any>, result: CommonRepoItem, collection: symbol, fn: RepoLengthLambda): void {
        if (!map) {
            if (collection) {
                result[collection.description] = -1;
            }
            else {
                result['*'] = -1;
            }
            return;
        }
        if (collection) {
            if (map.has(collection)) {
                result[collection.description] = map.get(collection).length;
                return;
            }
            else {
                result[collection.description] = -1;
            }
            return;
        }
        for (const [key, list] of map.entries()) {
            if (result[key.description] === undefined) {
                result[key.description] = fn(list);
            }
            else {
                result[key.description + '##' + Date.now()] = fn(list);
            }
        }
    }

    // region list
    /** @inheritDoc */
    newList<V>(...names: Array<string>): List<V> {
        const list = new List<V>();
        this._lists.set(Symbol.for(names.join('/')), list);
        return list;
    }

    /** @inheritDoc */
    getList<V>(collection: symbol): List<V> {
        return this._lists.get(collection) as List<V>;
    }

    // endregion list

    // region array
    /** @inheritDoc */
    newArray<V>(...names: Array<string>): Array<V> {
        const arr = [];
        this._arrays.set(Symbol.for(names.join('/')), arr);
        return arr;
    }

    /** @inheritDoc */
    getArray<V>(collection: symbol): Array<V> {
        return this._arrays.get(collection) as Array<V>;
    }

    // endregion array

    // region map
    /** @inheritDoc */
    newMap<K, V>(...names: Array<string>): Map<K, V> {
        const map = new Map<K, V>;
        this._maps.set(Symbol.for(names.join('/')), map);
        return map;
    }

    /** @inheritDoc */
    getMap<K, V>(collection: symbol): Map<K, V> {
        return this._maps.get(collection) as Map<K, V>;
    }

    // endregion map

    // region set
    /** @inheritDoc */
    newSet<V>(...names: Array<string>): Set<V> {
        const set = new Set<V>;
        this._sets.set(Symbol.for(names.join('/')), set);
        return set;
    }

    /** @inheritDoc */
    getSet<V>(collection: symbol): Set<V> {
        return this._sets.get(collection) as Set<V>;
    }

    // endregion set

    // region record
    /** @inheritDoc */
    newRecord<K extends string|symbol, V>(...names: Array<string>): Record<K, V> {
        const rec = {} as Record<K, V>;
        this._records.set(Symbol.for(names.join('/')), rec);
        return rec;
    }

    /** @inheritDoc */
    getRecord<K extends string|symbol, V>(collection: symbol): Record<K, V> {
        return this._records.get(collection) as Record<K, V>;
    }

    // endregion record

    // region detail
    /** @inheritDoc */
    detailItem(type: RepoType, collection?: symbol): CommonRepoItem {
        const result = {} as CommonRepoItem;
        switch (type) {
            case "array":
                this._addDetail(this._arrays, result, collection, (v: Arr) => v.length);
                return result;
            case "list":
                this._addDetail(this._lists, result, collection, (v: List<unknown>) => v.length);
                return result;
            case "map":
                this._addDetail(this._maps, result, collection, (v: Map<unknown, unknown>) => v.size);
                return result;
            case "record":
                this._addDetail(this._records, result, collection, (v: Record<string|symbol, unknown>) => (v && typeof v === 'object') ? Object.keys(v).length : -2);
                return result;
            case "set":
                this._addDetail(this._sets, result, collection, (v: Set<unknown>) => v.size);
                return result;
            default:
                this._addDetail(undefined, result, collection, (_v) => -2);
                return result;
        }
    }

    /** @inheritDoc */
    details(type?: RepoType, collection?: symbol): CommonRepoDetail {
        const result = {} as CommonRepoDetail;
        if (type) {
            result[type] = this.detailItem(type, collection);
        } else {
            result['array'] = this.detailItem('array', collection);
            result['list'] = this.detailItem('list', collection);
            result['map'] = this.detailItem('map', collection);
            result['set'] = this.detailItem('set', collection);
            result['record'] = this.detailItem('record', collection);
        }
        return result;
    }
    // endregion detail

    get $back(): CommonRepoLike {
        return this;
    }

    get $secure(): CommonRepoSecure {
        return this;
    }
}
