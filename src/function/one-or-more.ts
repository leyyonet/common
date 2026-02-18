import {OneOrMore} from "../base/index.js";

// noinspection JSUnusedGlobalSymbols
/**
 * Return array value from one or more type
 *
 * @param {OneOrMore} value - it can be one value or array value
 * @return {Array}
 * */
export function oneOrMore<T = unknown>(value: OneOrMore<T>): Array<T> | undefined {
    if (Array.isArray(value)) {
        return value as Array<T>;
    }
    if (value === undefined || value === null) {
        return undefined;
    }
    return [value] as Array<T>;
}
