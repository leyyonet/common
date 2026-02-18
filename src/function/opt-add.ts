import {optField} from "./opt-field.js";
import {isObj} from "./is-obj.js";
import {Opt} from "./index.types.js";

/**
 * Add key=value into options
 *
 * @param {Opt} options - source options
 * @param {string} key - key
 * @param {any} value - value
 * @return {Opt} - added options
 * */
export function optAdd<O extends Opt = Opt>(options: O | Opt, key: keyof O | string, value: unknown): O {
    const o = (isObj(options) ? options : {}) as O;
    if (value === undefined || typeof key !== 'string') {
        return o;
    }
    if (key === 'field') {
        return optField(o, value as string);
    }
    if (o[key] === undefined) {
        o[key as keyof O] = value as O[keyof O];
    }
    else if (o[key] instanceof Set) {
        o[key].add(value);
    }
    else {
        o[key as keyof O] = new Set([o[key], value]) as O[keyof O];
    }
    return o;
}
