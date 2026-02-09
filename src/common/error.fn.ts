// noinspection JSUnusedGlobalSymbols

import {
    ClassLike,
    ErrorDefineEagerOpt,
    ErrorDefineLazyOpt,
    ErrorItem,
    ErrorStackLine,
    LeyyoErrorLike,
    LeyyoErrorSecure,
    LeyyoStackLike,
    Opt
} from "../index.types";
import {isClass, isEmpty, isFilledArr, isFilledObj, isObj, isText} from "../function";
import {LY_ERROR_DECORATE_I18N, LY_ERROR_DEFAULT_MESSAGE, LY_ERROR_EMIT, LY_ERROR_EMITTED} from "../const";
import {FQN} from "../internal";
import {emitEvent} from "./event.fn";
import {DeveloperError} from "../error";
import {newRepoSet} from "./set.fn";
import {newRepoMap} from "./map.fn";
import * as stackTraceParser from "stacktrace-parser";

// region properties
const where = `${FQN}.ErrorFn`;
const _items = newRepoSet<ClassLike>(`${where}.items`);
const _names = newRepoMap<string, ErrorItem>(`${where}.names`);
const _knownPackages = newRepoMap<string, string>(`${where}.knownPackages`);
// endregion properties

// noinspection JSUnusedGlobalSymbols
/**
 * Define an error
 *
 * @param {ClassLike} clazz - error class
 * @param {ErrorDefineEagerOpt} options - options
 * */
export function defineError(clazz: ClassLike, options: ErrorDefineEagerOpt): void {
    if (!isClass(clazz)) {
        throw new DeveloperError('Invalid error class', 'defineError#01', where);
    }
    if (!isFilledObj(options)) {
        throw new DeveloperError('Invalid error options', 'defineError#02', where);
    }

    _items.add(clazz);
    _names.set(clazz.name, {...options, name: clazz.name, mode: 'eager', clazz});

    if (isText(options.message)) {
        clazz[LY_ERROR_DEFAULT_MESSAGE] = options.message;
    }
    if (!isEmpty(options.emit)) {
        clazz[LY_ERROR_EMIT] = options.emit;
    }
    if (!isEmpty(options.i18n)) {
        clazz[LY_ERROR_DECORATE_I18N] = options.i18n;
    }
}


/**
 * Check conflict case
 *
 * @param {string} name - error name
 * @param {EnumData} clazz - error class
 * @return {boolean} - if yes: it was already defined
 * */
function isAlreadyDefined(name: string, clazz: ClassLike): boolean {
    return _items.has(clazz) && _names.has(name);
}

/**
 * Define an error as lazy (with path)
 *
 * @param {ErrorDefineLazyOpt} opt - error options
 * */
export function defineLazyError(opt: ErrorDefineLazyOpt): void {
    if (!isFilledObj(opt)) {
        throw new DeveloperError('Invalid error options', 'onDeployed#01', where);
    }
    if (!(opt.lazyClass instanceof Promise)) {
        throw new DeveloperError('Invalid error class path', 'onDeployed#01', where);
    }
    _names.set(opt.name, {...opt, mode: 'lazy'});
}

/**
 * Check error defined as lazy, by name
 * Note:
 * - Error's mode will be shifted lazy to eager after loaded
 *
 * @param {string} name - error name
 * @return {boolean}
 * */
export function isErrorLazy(name: string): boolean {
    return getError(name)?.mode === 'lazy';
}

/**
 * Check error defined as eager, by name
 *
 * @param {string} name - error name
 * @return {boolean}
 * */
export function isErrorEager(name: string): boolean {
    return getError(name)?.mode === 'eager';
}

/**
 * Check error defined or not, by name
 *
 * @param {string} name - error name
 * @return {boolean}
 * */
export function isErrorDefined(name: string): boolean {
    return !!getError(name);
}

/**
 * Get error by name
 * Note:
 * - Enum may be lazy mode, so it has lazy paths without class
 *
 * @param {string} name - error name
 * @return {EnumItem}
 * */
export function getError(name: string): ErrorItem {
    if (!isText(name)) {
        return undefined;
    }
    if (!_names.has(name)) {
        return undefined;
    }
    return _names.get(name);
}

/**
 * Load lazy error by name
 * Note:
 * - Error must be exported as `foretell`
 *
 * @param {string} name - name of error
 * @return {Promise<EnumItem>}
 * */
export async function getLazyError(name: string): Promise<ErrorItem> {
    if (!isText(name)) {
        return undefined;
    }
    if (!_names.has(name)) {
        return undefined;
    }
    const item = _names.get(name);
    if (item.mode === 'eager') {
        return item;
    }
    try {
        item.clazz = await item.lazyClass;
        if (isClass(item.clazz)) {
            if (isAlreadyDefined(name, item.clazz)) {
                delete item.lazyClass;
                return item;
            }
            item.mode = 'eager';
        }
    } catch (e) {
        new DeveloperError('Raised callback run', 'optCheck#01', where).log(e);
    }
    delete item.lazyClass;
    return item;
}

/**
 * It will be called when an error raised
 * */
export function emitError(err: Error): void {
    if (!(err instanceof Error)) {
        return;
    }
    // already emitted
    if (err[LY_ERROR_EMITTED]) {
        return;
    }
    const clazz = err.constructor;

    // error does not support to emit
    if (!clazz[LY_ERROR_EMIT]) {
        return;
    }

    // prevent duplicated emits
    err[LY_ERROR_EMITTED] = true;
    emitEvent('error:emit', err);
}

/**
 * Build error stack
 *
 * @param {Error} source
 * @param {boolean?} force
 * */
export function errorStack(source: LeyyoStackLike, force?: boolean): void {
    if ( !force && Array.isArray(source.stackTrace)) {
        return;
    }
    source.stackTrace = [];
    try {
        let causedBy: Error;
        const leyyoError = source as LeyyoErrorLike;
        if (leyyoError.causedBy) {
            if (Array.isArray(leyyoError.causedBy) && leyyoError.causedBy.length > 0) {
                causedBy = leyyoError.causedBy[0];
            }
            else if (leyyoError.causedBy instanceof Error) {
                causedBy = leyyoError.causedBy;
            }
        }
        const original = causedBy?.stack ?? source.stack;
        if (original) {
            const frames = stackTraceParser.parse(original);
            if (Array.isArray(frames)) {
                frames.forEach(frame => {
                    if (['<unknown>', 'Object.<anonymous>'].includes(frame.methodName)) {
                        frame.methodName = undefined;
                    }
                    if (frame.file) {
                        if (frame.file.startsWith('node:')) {
                            frame.file = `@ ` + frame.file.substring(5);
                        }
                        else {
                            for (const [pck, short] of _knownPackages.entries()) {
                                const index = frame.file.indexOf(pck);
                                if (index >= 0) {
                                    let part = frame.file.substring(index + pck.length);
                                    if (part.startsWith('/')) {
                                        part = part.substring(1);
                                    }
                                    if (part.startsWith('dist/')) {
                                        part = part.substring(5);
                                    }
                                    frame.file = `#${short} ` + part;
                                    break;
                                }
                            }
                        }
                        if (frame.file.endsWith('.js') || frame.file.endsWith('.ts')) {
                            frame.file.substring(0, frame.file.length - 3);
                        }
                    }
                    const line = {} as ErrorStackLine;
                    if (frame.file) {
                        line.file = frame.file;
                    }
                    if (frame.methodName) {
                        line.method = frame.methodName;
                    }
                    if (frame.lineNumber !== undefined && frame.column !== undefined) {
                        line.pos = `${frame.lineNumber ?? ''}:${frame.column ?? ''}`;
                    }
                    source.stackTrace.push(line);
                });
            }
        }
    } catch (e) {
        // none
    }
}

/**
 * Transform error as a bare object without name and message
 *
 * @param {Error} err - error instance
 * @param {Opt} existing - existing parameters
 * @return {Opt?} - bare error object
 * */
export function toErrorJsonBasic(err: Error, existing?: Opt): Opt {
    return _toErrorJson(err, existing, true, new WeakSet<Error>());
}

/**
 * Transform error as a bare object with name and message
 *
 * @param {Error} err - error instance
 * @param {Opt} existing - existing parameters
 * @return {Opt?} - bare error object
 * */
export function toErrorJsonFull(err: Error, existing: Opt): Opt {
    return _toErrorJson(err, existing, false, new WeakSet<Error>());
}

/**
 * Transform error as a bare object
 *
 * @param {Error} err - error instance
 * @param {Opt} existing - existing parameters
 * @param {boolean} ignoreNameMessage - ignore name & message?
 * @param {WeakSet} weakSet - weak set to prevent duplicates
 * @return {Opt?} - bare error object
 * */
function _toErrorJson(err: Error, existing: Opt, ignoreNameMessage: boolean, weakSet: WeakSet<Error>): Opt {
    if (!(err instanceof Error)) {
        return undefined;
    }
    if (weakSet.has(err)) {
        return undefined;
    }
    weakSet.add(err);
    let result = isObj(existing) ? existing : {};
    const leyyoError = err as LeyyoErrorLike;
    if (isFilledObj(leyyoError.params)) {
        result = {...result, ...leyyoError.params};
    }
    for (const [k, v] of Object.entries(err)) {
        if (typeof k !== 'string' || ['undefined', 'symbol', 'function'].includes(typeof v) || v === null) {
            continue;
        }
        switch (k) {
            case 'name':
            case 'message':
                if (!ignoreNameMessage) {
                    result[k] = v;
                }
                break;
            case 'stack':
            case 'params':
                break;
            case 'causedBy':
                if (v instanceof Error) {
                    const causedBy = _toErrorJson(v, {}, false, weakSet);
                    if (causedBy) {
                        result[k] = v;
                    }
                }
                else if (isFilledArr(v)) {
                    const errors = v as Array<Error>;
                    const causedErrors = [] as Array<Opt>;
                    errors.forEach(e => {
                        const causedError = _toErrorJson(e, {}, false, weakSet);
                        if (causedError) {
                            causedErrors.push(causedError);
                        }
                    });
                    if (causedErrors.length > 0) {
                        result[k] = causedErrors;
                    }
                }
                break;
            default:
                result[k] = v;
                break;
        }
    }
}

/**
 * Cast a native error to given error class
 *
 * @param {function} clazz - new error class
 * @param {Error} e - native error instance
 * @param {Opt?} params - params for error
 * @return {LeyyoErrorLike} - new error instance
 * */
export function errorCast<E extends LeyyoErrorLike>(clazz: ClassLike, e: Error, params?: Opt): E {
    const err = new clazz(e.message, params) as E;
    (err as unknown as LeyyoErrorSecure).$copyProperties(e);
    err.causedBy = e;
    return err;
}

DeveloperError.stackBuilder(errorStack);
