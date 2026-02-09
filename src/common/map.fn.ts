import {isText} from "../function";
import {DeveloperError} from "../error";
import {FQN} from "../internal";

// region properties
/**
 * Internal items which stores collections
 * */
const items = new Map<symbol, Map<unknown, unknown>>();

/**
 * Internal volatiles repo which could be cleared after lifecycle run
 * */
const volatiles = new Set<symbol>();

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
    if (!isText(name)) {
        throw new DeveloperError('Invalid new map name', 'newMap#01', where);
    }
    const item = new Map<K, V>();
    const code = Symbol.for(name.split('#').join(''));
    items.set(code, item);
    if (volatile) {
        volatiles.add(code);
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
        items.delete(key);
        if (volatiles.has(key)) {
            volatiles.delete(key);
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
    if (!items.has(key)) {
        return -1;
    }
    const item = items.get(key);
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
    return Array.from(items.keys());
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
    for (const [sym, item] of items.entries()) {
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
