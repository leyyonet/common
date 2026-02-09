import {isObj, secureClone} from "../function";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {KeyValue, Opt, OptFn} from "../index.types";

// region properties
const where = `${FQN}.OptFn`;
// endregion properties

// noinspection JSUnusedGlobalSymbols
/**
 * It's used to easy arrow function usage for lazy evaluation of options
 *
 * @param {Opt} options - options
 * @return {Opt} - options
 * */
export function optFn<O extends Opt = Opt>(options: O | Opt): O {
    return (isObj(options) ? options : {}) as O;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Check option, if it's invalid, create empty options
 *
 * @param {(Opt|OptFn)} options - options or options callback
 * @return {Opt} - checked options
 * */
export function optCheck<O extends Opt = Opt>(options: O | OptFn<O> | Opt): O {
    let o = options as O;
    if (typeof options === 'function') {
        try {
            o = options();
        } catch (e) {
            o = {} as O;
            new DeveloperError('Raised callback run', 'optCheck#01', where).log(e);
        }
    }
    else if ( !isObj(options)) {
        o = {} as O;
    }
    return o;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Clone existing option
 *
 * @param {Opt} options - source options
 * @return {Opt} - cloned options
 * */
export function optClone<O extends Opt = Opt>(options: O | Opt): O {
    return secureClone(isObj(options) ? options : {}) as O;
}

/**
 * Merge two options
 *
 * @param {Opt} options - source options
 * @param {Opt} appended - appended options
 * @return {Opt} - merged options
 * */
export function optAppend<O extends Opt = Opt>(options: O | Opt, appended: O | Opt): O {
    const o = (isObj(options) ? options : {}) as O;
    if ( !isObj(appended)) {
        return o;
    }
    for (const [k, v] of Object.entries(appended)) {
        if (o[k] === undefined) {
            o[k as keyof O] = v as O[keyof O];
        }
        else {
            optAdd(o, k, v);
        }
    }
    return o;
}

/**
 * Add key=value into options
 *
 * @param {Opt} options - source options
 * @param {string} key - key
 * @param {any} value - value
 * @return {Opt} - added options
 * */
export function optAdd<O extends Opt = Opt>(options: O | OptFn<O> | Opt, key: keyof O | string, value: unknown): O {
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

/**
 * Add field into options
 * Note: field could not be multiple in option
 *
 * @param {Opt} options - source options
 * @param {KeyValue} field - value
 * @return {Opt} - added options
 * */
export function optField<O extends Opt = Opt>(options: O | OptFn<O> | Opt, field: KeyValue): O {
    const o = (isObj(options) ? options : {}) as O;
    const t = typeof field;
    if ( !['string', 'number'].includes(t)) {
        return o;
    }
    if (o.field !== undefined) {
        if (typeof o.field !== 'string') {
            o.field = '';
        }
    }
    else {
        o.field = '';
    }

    if ( !o.field) {
        o.field = (t === 'string') ? (field as string) : `$.[${field}]`;
    }
    else {
        o.field += (t === 'string') ? `.${field}` : `[${field}]`;
    }
    return o;
}
