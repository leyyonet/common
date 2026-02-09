import {ExtendedType} from "../index.types";
import {isClass} from "./is";
import {List} from "../class";
import {LY_ENUM_NAME} from "../const";

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
            if (trimmed === '') {
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
            if (!value) {
                return 'null';
            }
            if (Array.isArray(value)) {
                if (value[LY_ENUM_NAME]) {
                    return 'enum';
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
            return value[LY_ENUM_NAME] ? 'enum' : 'object';
        case "function":
            return isClass(value) ? 'class' : 'function';
        default:
            return typeof value;
    }
}
