import {FQN} from "../internal.js";
import {testCase} from "./test-case.js";
import {LeyyoLike} from "../base/index.js";
import {$$get_leyyo_fn} from "./leyyo-fn.js";

const where = `${FQN}.GetProp`;
let _leyyo: LeyyoLike;

/**
 * Get target property
 *
 * @param {any} target - target
 * @param {string} key - key
 * @return {any}
 * */
export function getKey<T>(target: unknown, key: string): T {
    if (typeof key !== 'string') {
        return undefined;
    }
    return getProp(target, key);
}

/**
 * Get target hidden property
 *
 * @param {any} target - target
 * @param {symbol} key - hidden key
 * @return {any}
 * */
export function getSymbol<T>(target: unknown, key: symbol): T {
    if (typeof key !== 'symbol') {
        return undefined;
    }
    return getProp(target, key);
}

/**
 * Get target property
 *
 * @param {any} target - target
 * @param {(symbol|string)} key - key
 * @return {any}
 * */
export function getProp<T>(target: unknown, key: symbol | string): T {
    if ( !['symbol', 'string'].includes(typeof key)) {
        return undefined;
    }
    if ( !target || !['object', 'function'].includes(typeof target)) {
        return undefined;
    }
    try {
        const prop = Object.getOwnPropertyDescriptor(target, key);
        return prop?.value;
    } catch (e) {
        if ( !_leyyo) {
            _leyyo = $$get_leyyo_fn();
        }
        new _leyyo.developerError(`Unexpected error during set name [${key.toString()}]`, testCase(FQN, 'ZZZ'), where).log(e);
        return undefined;
    }
}
