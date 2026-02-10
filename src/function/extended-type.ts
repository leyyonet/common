import {ExtendedType} from "../base";
import {List} from "../class";
import {KEY_ENUM_NAME, KEY_LITERAL_NAME} from "../const";
import {isClass} from "./is.fn";


// noinspection JSUnusedGlobalSymbols
/**
 * Get extended type of value
 *
 * @param {any} value - given value
 * @return {ExtendedType}
 * */
export function extendedType(value: unknown): ExtendedType {
    switch (typeof value) {
        case "string":
            const trimmed = value.trim();
            if ( !trimmed) {
                return 'empty';
            }
            else if (trimmed === value) {
                return 'text';
            }
            return 'string';
        case 'number':
            if (isNaN(value)) {
                return 'nan';
            }
            return Number.isInteger(value) ? 'integer' : 'number';
        case 'object':
            if ( !value) {
                return 'null';
            }
            if (Array.isArray(value)) {
                if (value[KEY_LITERAL_NAME]) {
                    return 'literal-items';
                }
                return (value instanceof List) ? 'list' : 'array';
            }
            if (value instanceof Date) {
                return 'date';
            }
            if (value instanceof Map) {
                return 'map';
            }
            if (value instanceof Set) {
                return 'set';
            }
            if (value[KEY_ENUM_NAME]) {
                return 'enum-map';
            }
            return 'object';
        case "function":
            return isClass(value) ? 'class' : 'function';
        default:
            return typeof value;
    }
}
