import {EMPTY_VALUES} from "../const";
import {Fnc} from "../index.types";

/**
 * Is bare object?
 * Means:
 * - `constructor === "Object"`
 *
 * @param {any} obj - given value
 * @return {boolean} - is bare object?
 * */
export function isObj (obj: unknown): boolean {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * Is filled object?
 * Means:
 * - `constructor === "Object"`
 * - `obj.keys.length > 0`
 *
 * @param {any} obj - given value
 * @return {boolean} - is filled object?
 * */
export function isFilledObj (obj: unknown): boolean {
    return isObj(obj) && Object.keys(obj).length > 0;
}

/**
 * Is filled array?
 * Means
 * - `constructor === "Array"`
 * - `arr.length > 0`
 *
 * @param {any} arr - given value
 * @return {boolean} - is filled array?
 * */
export function isFilledArr (arr: unknown): boolean {
    return Array.isArray(arr) && arr.length > 0;
}

/**
 * Is text?
 * Means:
 * - `typeof === "string"`
 * - `not empty string`
 * - `not starts/ends with space`
 *
 * @param {any} str - given value
 * @return {boolean} - is text?
 * */
export function isText (str: unknown): boolean {
    return typeof str === 'string' && str !== '' && str.trim() === str;
}

/**
 * Is empty?
 * Means:
 * - `not null`
 * - `not undefined`
 * - `not empty string`
 *
 * @param {any} value - given value
 * @return {boolean} - is empty?
 * */
export function isEmpty (value: unknown): boolean {
    return EMPTY_VALUES.includes(value) || (typeof value === 'string' && value.trim() === '');
}

/**
 * Is class?
 *
 * @param {any} fn - given value
 * @return {boolean} - is class?
 * */
export function isClass(fn: unknown): boolean {
    // Class constructor is also a function
    if(!(fn && fn.constructor === Function) || (fn as Fnc).prototype === undefined) {
        return false;
    }

    // This is a class that extends other class
    if(Function.prototype !== Object.getPrototypeOf(fn)) {
        return true;
    }

    // Usually a function will only have 'constructor' in the prototype
    return Object.getOwnPropertyNames((fn as Fnc).prototype).length > 1;
}
