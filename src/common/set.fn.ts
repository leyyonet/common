import {isText} from "../function";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {addLifecycleStage} from "./lifecycle.fn";
import {testCase} from "./test.fn";

// region properties
/**
 * Internal items which stores collections
 * */
const _items = new Map<symbol, Set<unknown>>();

/**
 * Internal volatiles repo which could be cleared after lifecycle run
 * */
const _volatiles = new Set<symbol>();

/**
 * Identifier of file
 * */
const where = `${FQN}.SetFn`;
// endregion properties

// noinspection JSUnusedGlobalSymbols
/**
 * Create new set
 *
 * @param {string} name - name of collection
 * @param {boolean} volatile - if yes: it will be removed after lifecycle run
 * @return {Set<any>}
 * */
export function newRepoSet<V>(name: string, volatile?: boolean): Set<V> {
    if ( !isText(name)) {
        throw new DeveloperError('Invalid repository set name', testCase(FQN, 143), where);
    }
    const item = new Set<V>();
    const code = Symbol.for(name.split('#').join(''));
    _items.set(code, item);
    if (volatile) {
        _volatiles.add(code);
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
export function removeRepoSet(key: symbol): number {
    const cleared = clearRepoSet(key);
    if (cleared >= 0) {
        _items.delete(key);
        if (_volatiles.has(key)) {
            _volatiles.delete(key);
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
export function clearRepoSet(key: symbol): number {
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
 * List all set keys
 *
 * @return {Array<symbol>}
 * */
export function listRepoSets(): Array<symbol> {
    return Array.from(_items.keys());
}

// noinspection JSUnusedGlobalSymbols
/**
 * Print all sets
 *
 * @return {Record} - as {key: length of collection}
 *
 * Note: if stringified symbol is duplicated, add index postfix with `#` symbol
 * */
export function printRepoSets(): Record<string, number> {
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
addLifecycleStage('clear', 'repo-set', () => {
    Array.from(_volatiles.values())
        .forEach(key => _items.delete(key));
    _volatiles.clear();
});
