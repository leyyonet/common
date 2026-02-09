import {isText} from "../function";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {addLifecycleStage} from "./lifecycle.fn";
import {testCase} from "./test.fn";

// region properties
/**
 * Internal items which stores collections
 * */
const _items = new Map<symbol, Map<unknown, unknown>>();

/**
 * Internal volatiles repo which could be cleared after lifecycle run
 * */
const _volatiles = new Set<symbol>();

/**
 * Identifier of file
 * */
const where = `${FQN}.MapFn`;
// endregion properties

// noinspection JSUnusedGlobalSymbols
/**
 * Create new map
 *
 * @param {string} name - name of collection
 * @param {boolean} volatile - if yes: it will be removed after lifecycle run
 * @return {Map<any, any>}
 * */
export function newRepoMap<K, V>(name: string, volatile?: boolean): Map<K, V> {
    if ( !isText(name)) {
        throw new DeveloperError('Invalid repository map name', testCase(FQN, 142), where);
    }
    const item = new Map<K, V>();
    const code = Symbol.for(name.split('#').join(''));
    _items.set(code, item);
    if (volatile) {
        _volatiles.add(code);
    }
    return item;
}

// noinspection JSUnusedGlobalSymbols
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
export function removeRepoMap(key: symbol): number {
    const cleared = clearRepoMap(key);
    if (cleared >= 0) {
        _items.delete(key);
        if (_volatiles.has(key)) {
            _volatiles.delete(key);
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
export function clearRepoMap(key: symbol): number {
    if (typeof key !== 'symbol') {
        return -2;
    }
    if ( !_items.has(key)) {
        return -1;
    }
    const item = _items.get(key);
    const length = item.size;
    item.clear();
    return length;
}

// noinspection JSUnusedGlobalSymbols
/**
 * List all map keys
 *
 * @return {Array<symbol>}
 * */
export function listRepoMaps(): Array<symbol> {
    return Array.from(_items.keys());
}

// noinspection JSUnusedGlobalSymbols
/**
 * Print all maps
 *
 * @return {Record} - as {key: length of collection}
 *
 * Note: if stringified symbol is duplicated, add index postfix with `#` symbol
 * */
export function printMaps(): Record<string, number> {
    const result = {} as Record<string, number>;
    let index = 0;
    for (const [sym, item] of _items.entries()) {
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

// clear volatile items
addLifecycleStage('clear', 'repo-map', () => {
    Array.from(_volatiles.values())
        .forEach(key => _items.delete(key));
    _volatiles.clear();
});

