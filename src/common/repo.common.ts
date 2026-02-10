import {FQN} from "../internal";
import {isText, testCase} from "../function";
import {DeveloperError} from "../error";
import {List} from "../class";
import {RepoCommonLike} from "./index.types";
import {LeyyoLike} from "../base";

/**
 * Identifier of file
 * */
const where = `${FQN}.Repo`;

// noinspection JSUnusedGlobalSymbols
export class RepoCommon implements RepoCommonLike {

    // region property
    private static _created: boolean;
    /**
     * Internal items which stores arrays
     * */
    private _arrayItems = new Map<symbol, Array<unknown>>();

    /**
     * Internal array volatile repo which could be cleared after lifecycle run
     * */
    private _arrayVolatiles = new Set<symbol>();

    /**
     * Internal items which stores lists
     * */
    private _listItems = new Map<symbol, List>();

    /**
     * Internal list volatiles repo which could be cleared after lifecycle run
     * */
    private _listVolatiles = new Set<symbol>();

    /**
     * Internal items which stores maps
     * */
    private _mapItems = new Map<symbol, Map<unknown, unknown>>();

    /**
     * Internal map volatile repo which could be cleared after lifecycle run
     * */
    private _mapVolatiles = new Set<symbol>();

    /**
     * Internal items which stores sets
     * */
    private _setItems = new Map<symbol, Set<unknown>>();

    /**
     * Internal set volatiles repo which could be cleared after lifecycle run
     * */
    private _setVolatiles = new Set<symbol>();

    // endregion property

    constructor(private leyyo: LeyyoLike) {
        if (RepoCommon._created) {
            throw new Error('ZZZ');
        }
        RepoCommon._created = true;
    }

    // region array
    /**
     * Create new array
     *
     * @param {string} name - name of collection
     * @param {boolean} volatile - if yes: it will be removed after lifecycle run
     * @return {Array<any>}
     * */
    newArray<V>(name: string, volatile?: boolean): Array<V> {
        if ( !isText(name)) {
            throw new DeveloperError('Invalid repository array name', testCase(FQN, 140), where);
        }
        const item = [] as Array<V>;
        const code = Symbol.for(name.split('#').join(''));
        this._arrayItems.set(code, item);
        if (volatile) {
            this._arrayVolatiles.add(code);
        }
        return item;
    }

    /**
     * Remove array by given key
     *
     * @param {symbol} key - key of collection
     * @return {number}
     *
     * Return possibilities:
     *  - `-2`: key is not valid symbol
     *  - `-1`: key does not exist
     *  - `>= 0`: length of removed items in collection
     * */
    removeArray(key: symbol): number {
        const cleared = this.clearArray(key);
        if (cleared >= 0) {
            this._arrayItems.delete(key);
            if (this._arrayVolatiles.has(key)) {
                this._arrayVolatiles.delete(key);
            }
        }
        return cleared;
    }

    /**
     * Clear array by given key
     *
     * @param {symbol} key - key of collection
     * @return {number}
     *
     * Return possibilities:
     *  - `-2`: key is not valid symbol
     *  - `-1`: key does not exist
     *  - `>= 0`: length of cleared items in collection
     * */
    clearArray(key: symbol): number {
        if (typeof key !== 'symbol') {
            return -2;
        }
        if ( !this._arrayItems.has(key)) {
            return -1;
        }
        const item = this._arrayItems.get(key);
        const length = item.length;
        item.splice(0, length);
        return length;
    }

    /**
     * List all array keys
     *
     * @return {Array<symbol>}
     * */
    listArrays(): Array<symbol> {
        return Array.from(this._arrayItems.keys());
    }

    /**
     * Print all arrays
     *
     * @return {Record} - as {key: length of collection}
     *
     * Note: if stringified symbol is duplicated, add index postfix with `#` symbol
     * */
    printArrays(): Record<string, number> {
        const result = {} as Record<string, number>;
        let index = 0;
        for (const [sym, item] of this._arrayItems.entries()) {
            const key = sym.description;
            if (result[key] === undefined) {
                result[key] = item.length;
                index = 0;
            }
            else {
                index++;
                result[`${key}#${index}`] = item.length;
            }
        }
        return result;
    }

    // endregion array

    // region list
    /**
     * Create new list
     *
     * @param {string} name - name of collection
     * @param {boolean} volatile - if yes: it will be removed after lifecycle run
     * @return {List<any>}
     * */
    newList<V>(name: string, volatile?: boolean): List<V> {
        if ( !isText(name)) {
            throw new DeveloperError('Invalid repository list name', testCase(FQN, 141), where);
        }
        const item = new List<V>();
        const code = Symbol.for(name.split('#').join(''));
        this._listItems.set(code, item);
        if (volatile) {
            this._listVolatiles.add(code);
        }
        return item;
    }

    /**
     * Remove list by given key
     *
     * @param {symbol} key - key of collection
     * @return {number}
     *
     * Return possibilities:
     *  - `-2`: key is not valid symbol
     *  - `-1`: key does not exist
     *  - `>= 0`: length of removed items in collection
     * */
    removeList(key: symbol): number {
        const cleared = this.clearList(key);
        if (cleared >= 0) {
            this._listItems.delete(key);
            if (this._listVolatiles.has(key)) {
                this._listVolatiles.delete(key);
            }
        }
        return cleared;
    }

    /**
     * Clear list by given key
     *
     * @param {symbol} key - key of collection
     * @return {number}
     *
     * Return possibilities:
     *  - `-2`: key is not valid symbol
     *  - `-1`: key does not exist
     *  - `>= 0`: length of cleared items in collection
     * */
    clearList(key: symbol): number {
        if (typeof key !== 'symbol') {
            return -2;
        }
        if ( !this._listItems.has(key)) {
            return -1;
        }
        const item = this._listItems.get(key);
        const length = item.length;
        item.clear();
        return length;
    }

    /**
     * List all list keys
     *
     * @return {Array<symbol>}
     * */
    listLists(): Array<symbol> {
        return Array.from(this._listItems.keys());
    }

    /**
     * Print all lists
     *
     * @return {Record} - as {key: length of collection}
     *
     * Note: if stringified symbol is duplicated, add index postfix with `#` symbol
     * */
    printLists(): Record<string, number> {
        const result = {} as Record<string, number>;
        let index = 0;
        for (const [sym, item] of this._listItems.entries()) {
            const key = sym.description;
            if (result[key] === undefined) {
                result[key] = item.length;
                index = 0;
            }
            else {
                index++;
                result[`${key}#${index}`] = item.length;
            }
        }
        return result;
    }

    // endregion list

    // region map
    /**
     * Create new map
     *
     * @param {string} name - name of collection
     * @param {boolean} volatile - if yes: it will be removed after lifecycle run
     * @return {Map<any, any>}
     * */
    newMap<K, V>(name: string, volatile?: boolean): Map<K, V> {
        if ( !isText(name)) {
            throw new DeveloperError('Invalid repository map name', testCase(FQN, 142), where);
        }
        const item = new Map<K, V>();
        const code = Symbol.for(name.split('#').join(''));
        this._mapItems.set(code, item);
        if (volatile) {
            this._mapVolatiles.add(code);
        }
        return item;
    }

    /**
     * Remove map by given key
     *
     * @param {symbol} key - key of collection
     * @return {number}
     *
     * Return possibilities:
     *  - `-2`: key is not valid symbol
     *  - `-1`: key does not exist
     *  - `>= 0`: length of removed items in collection
     * */
    removeMap(key: symbol): number {
        const cleared = this.clearMap(key);
        if (cleared >= 0) {
            this._mapItems.delete(key);
            if (this._mapVolatiles.has(key)) {
                this._mapVolatiles.delete(key);
            }
        }
        return cleared;
    }

    /**
     * Clear map by given key
     *
     * @param {symbol} key - key of collection
     * @return {number}
     *
     * Return possibilities:
     *  - `-2`: key is not valid symbol
     *  - `-1`: key does not exist
     *  - `>= 0`: length of cleared items in collection
     * */
    clearMap(key: symbol): number {
        if (typeof key !== 'symbol') {
            return -2;
        }
        if ( !this._mapItems.has(key)) {
            return -1;
        }
        const item = this._mapItems.get(key);
        const length = item.size;
        item.clear();
        return length;
    }

    /**
     * List all map keys
     *
     * @return {Array<symbol>}
     * */
    listMaps(): Array<symbol> {
        return Array.from(this._mapItems.keys());
    }

// noinspection JSUnusedGlobalSymbols
    /**
     * Print all maps
     *
     * @return {Record} - as {key: length of collection}
     *
     * Note: if stringified symbol is duplicated, add index postfix with `#` symbol
     * */
    printMaps(): Record<string, number> {
        const result = {} as Record<string, number>;
        let index = 0;
        for (const [sym, item] of this._mapItems.entries()) {
            const key = sym.description;
            if (result[key] === undefined) {
                result[key] = item.size;
                index = 0;
            }
            else {
                index++;
                result[`${key}#${index}`] = item.size;
            }
        }
        return result;
    }

    // endregion map

    // region set
    /**
     * Create new set
     *
     * @param {string} name - name of collection
     * @param {boolean} volatile - if yes: it will be removed after lifecycle run
     * @return {Set<any>}
     * */
    newSet<V>(name: string, volatile?: boolean): Set<V> {
        if ( !isText(name)) {
            throw new DeveloperError('Invalid repository set name', testCase(FQN, 143), where);
        }
        const item = new Set<V>();
        const code = Symbol.for(name.split('#').join(''));
        this._setItems.set(code, item);
        if (volatile) {
            this._setVolatiles.add(code);
        }
        return item;
    }

// noinspection JSUnusedGlobalSymbols
    /**
     * Remove set by given key
     *
     * @param {symbol} key - key of collection
     * @return {number}
     *
     * Return possibilities:
     *  - `-2`: key is not valid symbol
     *  - `-1`: key does not exist
     *  - `>= 0`: length of removed items in collection
     * */
    removeSet(key: symbol): number {
        const cleared = this.clearSet(key);
        if (cleared >= 0) {
            this._setItems.delete(key);
            if (this._setVolatiles.has(key)) {
                this._setVolatiles.delete(key);
            }
        }
        return cleared;
    }

    /**
     * Clear set by given key
     *
     * @param {symbol} key - key of collection
     * @return {number}
     *
     * Return possibilities:
     *  - `-2`: key is not valid symbol
     *  - `-1`: key does not exist
     *  - `>= 0`: length of cleared items in collection
     * */
    clearSet(key: symbol): number {
        if (typeof key !== 'symbol') {
            return -2;
        }
        if ( !this._setItems.has(key)) {
            return -1;
        }
        const item = this._setItems.get(key);
        const length = item.size;
        item.clear();
        return length;
    }

// noinspection JSUnusedGlobalSymbols
    /**
     * List all set keys
     *
     * @return {Array<symbol>}
     * */
    listSets(): Array<symbol> {
        return Array.from(this._setItems.keys());
    }

// noinspection JSUnusedGlobalSymbols
    /**
     * Print all sets
     *
     * @return {Record} - as {key: length of collection}
     *
     * Note: if stringified symbol is duplicated, add index postfix with `#` symbol
     * */
    printSets(): Record<string, number> {
        const result = {} as Record<string, number>;
        let index = 0;
        for (const [sym, item] of this._setItems.entries()) {
            const key = sym.description;
            if (result[key] === undefined) {
                result[key] = item.size;
                index = 0;
            }
            else {
                index++;
                result[`${key}#${index}`] = item.size;
            }
        }
        return result;
    }

    // endregion set

    // region secure
    init(): void {
        const lifecycle = this.leyyo.lifecycleCommon;
        // clear volatile arrays
        lifecycle.addStage('clear', 'repo.array', () => {
            Array.from(this._arrayVolatiles.values())
                .forEach(key => this._arrayItems.delete(key));
            this._arrayVolatiles.clear();
        });

        // clear volatile lists
        lifecycle.addStage('clear', 'repo.list', () => {
            Array.from(this._listVolatiles.values())
                .forEach(key => this._listItems.delete(key));
            this._listVolatiles.clear();
        });

        // clear volatile maps
        lifecycle.addStage('clear', 'repo.map', () => {
            Array.from(this._mapVolatiles.values())
                .forEach(key => this._mapItems.delete(key));
            this._mapVolatiles.clear();
        });

        // clear volatile sets
        lifecycle.addStage('clear', 'repo.set', () => {
            Array.from(this._setVolatiles.values())
                .forEach(key => this._setItems.delete(key));
            this._setVolatiles.clear();
        });

        this.init = () => {
        };
    }

    // endregion secure
}
