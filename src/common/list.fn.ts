import {isText} from "../function";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {List} from "../class";
import {addLifecycleStage} from "./lifecycle.fn";
import {testCase} from "./test.fn";

// region properties
/**
 * Internal items which stores collections
 * */
const _items = new Map<symbol, List>();

/**
 * Internal volatiles repo which could be cleared after lifecycle run
 * */
const _volatiles = new Set<symbol>();

/**
 * Identifier of file
 * */
const where = `${FQN}.ListFn`;
// endregion properties

// noinspection JSUnusedGlobalSymbols
/**
 * Create new list
 *
 * @param {string} name - name of collection
 * @param {boolean} volatile - if yes: it will be removed after lifecycle run
 * @return {List<any>}
 * */
export function newRepoList<V>(name: string, volatile?: boolean): List<V> {
    if ( !isText(name)) {
        throw new DeveloperError('Invalid repository list name', testCase(FQN, 141), where);
    }
    const item = new List<V>();
    const code = Symbol.for(name.split('#').join(''));
    _items.set(code, item);
    if (volatile) {
        _volatiles.add(code);
    }
    return item;
}

// noinspection JSUnusedGlobalSymbols
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
export function removeRepoList(key: symbol): number {
    const cleared = clearRepoList(key);
    if (cleared >= 0) {
        _items.delete(key);
        if (_volatiles.has(key)) {
            _volatiles.delete(key);
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
export function clearRepoList(key: symbol): number {
    if (typeof key !== 'symbol') {
        return -2;
    }
    if ( !_items.has(key)) {
        return -1;
    }
    const item = _items.get(key);
    const length = item.length;
    item.clear();
    return length;
}

// noinspection JSUnusedGlobalSymbols
/**
 * List all list keys
 *
 * @return {Array<symbol>}
 * */
export function listRepoLists(): Array<symbol> {
    return Array.from(_items.keys());
}

// noinspection JSUnusedGlobalSymbols
/**
 * Print all lists
 *
 * @return {Record} - as {key: length of collection}
 *
 * Note: if stringified symbol is duplicated, add index postfix with `#` symbol
 * */
export function printRepoLists(): Record<string, number> {
    const result = {} as Record<string, number>;
    let index = 0;
    for (const [sym, item] of _items.entries()) {
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

// clear volatile items
addLifecycleStage('clear', 'repo-list', () => {
    Array.from(_volatiles.values())
        .forEach(key => _items.delete(key));
    _volatiles.clear();
});
