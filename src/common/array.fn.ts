import {isText} from "../function";
import {DeveloperError} from "../error";
import {FQN} from "../internal";

// region properties
/**
 * Internal items which stores collections
 * */
const items = new Map<symbol, Array<unknown>>();

/**
 * Internal volatiles repo which could be cleared after lifecycle run
 * */
const volatiles = new Set<symbol>();

/**
 * Identifier of file
 * */
const where = `${FQN}.ArrayFn`;
// endregion properties

// noinspection JSUnusedGlobalSymbols
/**
 * Create new array
 *
 * @param {string} name - name of collection
 * @param {boolean} volatile - if yes: it will be removed after lifecycle run
 * @return {Array<any>}
 * */
export function newRepoArray<V>(name: string, volatile?: boolean): Array<V> {
    if (!isText(name)) {
        throw new DeveloperError('Invalid new array name', 'newArray#01', where);
    }
    const item = [] as Array<V>;
    const code = Symbol.for(name.split('#').join(''));
    items.set(code, item);
    if (volatile) {
        volatiles.add(code);
    }
    return item;
}

// noinspection JSUnusedGlobalSymbols
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
export function removeRepoArray(key: symbol): number {
    const cleared = clearRepoArray(key);
    if (cleared >= 0) {
        items.delete(key);
        if (volatiles.has(key)) {
            volatiles.delete(key);
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
export function clearRepoArray(key: symbol): number {
    if (typeof key !== 'symbol') {
        return -2;
    }
    if (!items.has(key)) {
        return -1;
    }
    const item = items.get(key);
    const length = item.length;
    item.splice(0, length);
    return length;
}

// noinspection JSUnusedGlobalSymbols
/**
 * List all array keys
 *
 * @return {Array<symbol>}
 * */
export function listRepoArrays(): Array<symbol> {
    return Array.from(items.keys());
}

// noinspection JSUnusedGlobalSymbols
/**
 * Print all arrays
 *
 * @return {Record} - as {key: length of collection}
 *
 * Note: if stringified symbol is duplicated, add index postfix with `#` symbol
 * */
export function printRepoArrays(): Record<string, number> {
    const result = {} as Record<string, number>;
    let index = 0;
    for (const [sym, item] of items.entries()) {
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
