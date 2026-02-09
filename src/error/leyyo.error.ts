import {
    ClassLike,
    ErrorStackLine,
    LeyyoErrorLike,
    LeyyoErrorSecure,
    LeyyoErrorTag,
    Logger,
    Obj,
    OneOrMore,
    Opt,
    StrKey
} from "../index.types";
import {FQN} from "../internal";
import {emitError, errorStack, getFqn, optAdd, optAppend} from "../common";
import {errorText, isFilledObj, isObj, isText} from "../function";
import {DeveloperError} from "./developer.error";
import {LY_ERROR_DEFAULT_MESSAGE, LY_ERROR_EMIT, LY_ERROR_FLAGS, LY_ERROR_UNKNOWN_MESSAGE} from "../const";
import {LogLevel} from "../enum";
import {emitLog} from "../common/log.fn";

type T2 = LeyyoErrorTag;

// region property
const ERROR_FIELDS = ['name', 'message', 'stack'] as Array<StrKey<Error>>;
const LEYYO_ERROR_FIELDS = [...ERROR_FIELDS, 'params', 'causedBy', 'stackTrace'] as Array<StrKey<LeyyoErrorLike>>;
const where = `${FQN}.LeyyoError`;
const knownPackages = new Map<string, string>;

const LY_ERROR_WHERE = '1';
// endregion property

/**
 * Leyyo base error
 * */
export class LeyyoError extends Error implements LeyyoErrorLike, LeyyoErrorSecure {
    /**
     * Error flags
     * */
    private [LY_ERROR_FLAGS]: Set<T2>;

    /**
     * Error parameters
     * */
    params?: Opt;

    /**
     * Caused by error
     * */
    causedBy?: OneOrMore<Error>;

    /**
     * Stack trace
     * */
    stackTrace?: Array<ErrorStackLine>;
    private [LY_ERROR_WHERE]?: string;

    /**
     * @param {string} message - error message
     * */
    constructor(message: string);

    /**
     * @param {Opt} params - error parameters
     * */
    constructor(params: Opt);

    /**
     * @param {string} message - error message
     * @param {Opt} params - error parameters
     * */
    constructor(message: string, params: Opt);

    /**
     * @param {(string|Opt)} p1 - error message or error parameters
     * @param {Opt?} p2 - error parameters
     * */
    constructor(p1: string | Opt, p2?: Opt) {
        let message: string;
        let params: Opt;
        if (typeof p1 === 'string') {
            message = p1;
            params = p2;
        }
        else {
            message = LY_ERROR_UNKNOWN_MESSAGE;
            params = p1;
        }
        super(message);

        const clazz = this.constructor;
        if ( !message && typeof clazz[LY_ERROR_DEFAULT_MESSAGE] === 'string') {
            this.message = clazz[LY_ERROR_DEFAULT_MESSAGE];
        }

        if (params && typeof params === 'object' && !Array.isArray(params)) {
            this.params = params;
        }
        this.name = getFqn(clazz);
        errorStack(this);

        if (clazz[LY_ERROR_EMIT]) {
            emitError(this);
        }
    }

    // region bind
    causes(err: Error): this {
        if (err instanceof Error) {
            if (!this.causedBy) {
                this.causedBy = err;
            }
            else if (this.causedBy instanceof Error) {
                this.causedBy = [this.causedBy, err];
            }
            else if (Array.isArray(this.causedBy)) {
                this.causedBy.push(err);
            }
            else {
                this.causedBy = [this.causedBy, err];
            }
        }
        return this;
    }

    where(p1: ClassLike|Obj|string, fqn?: string): this {
        if (typeof p1 === 'function') {
            this[LY_ERROR_WHERE] = getFqn(p1);
        }
        else if (p1 && typeof p1 === 'object') {
            this[LY_ERROR_WHERE] = getFqn(p1);
        }
        else if (p1 && typeof p1 === 'string' && p1.trim()) {
            if (typeof fqn === 'string') {
                fqn = fqn.trim();
                fqn = fqn ? `${fqn}.` : '';
            }
            else {
                fqn = '';
            }
            this[LY_ERROR_WHERE] = fqn + p1.trim();
        }
        return this;
    }
    // endregion bind

    // region static
    /**
     * Cast a native error to given error class
     *
     * @param {function} clazz - new error class
     * @param {Error} e - native error instance
     * @param {Opt?} params - params for error
     * @return {LeyyoErrorLike} - new error instance
     * */
    static cast<E extends LeyyoErrorLike>(clazz: ClassLike, e: Error, params?: Opt): E {
        const err = new clazz(e.message, params) as E;
        (err as unknown as LeyyoErrorSecure).$copyProperties(e);
        err.causedBy = e;
        return err;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Add known package to shorten stack paths
     *
     * @param {string} packageName - original package name, like @package/component
     * @param {string} shortName - short name for given package
     * */
    static addKnownPackage(packageName: string, shortName: string): void {
        if ( !isText(packageName)) {
            throw new DeveloperError('Invalid package name', 'addKnownPackage#01', where);
        }
        if ( !isText(shortName)) {
            throw new DeveloperError('Invalid short name', 'addKnownPackage#02', where);
        }
        if (knownPackages.has(shortName)) {
            throw new DeveloperError('Duplicated package name', 'addKnownPackage#03', where);
        }
        knownPackages.set(packageName, shortName);
    }

    /**
     * Build easy error text as `<info> [err:error.name] => [error.message]`
     *
     * @param {Error} e - error instance
     * @param {...Array<string|number>} parts - parts for info
     * @return {string}
     * */
    static text(e: Error, ...parts: Array<string | number>): string {
        parts = parts.map(p => {
            if (typeof p === 'string') {
                p = p.trim();
                return (p !== '') ? p : undefined;
            }
            else if (typeof p === 'number') {
                return p.toString(10);
            }
            else {
                return undefined;
            }
        }).filter(p => p !== undefined);
        const info = parts.length > 0 ? '<' + parts.join('/') + '> ' : '';
        if ( !(e instanceof Error)) {
            return info;
        }
        return `${info}${errorText(e)}`;
    }

    // endregion static

    // region log
    private _log(level: LogLevel, logger?: Logger): void {
        if (logger) {
            logger[level](this);
        }
        else {
            emitLog(level, undefined, this, {});
        }
    }

    /** @inheritDoc */
    log(logger?: Logger): void {
        this._log('error', logger);
    }

    logFatal(logger?: Logger): void {
        this._log('fatal', logger);
    }

    logError(logger?: Logger): void {
        this._log('error', logger);
    }

    /** @inheritDoc */
    logWarn(logger?: Logger): void {
        this._log('warn', logger);
    }

    /** @inheritDoc */
    logDebug(logger?: Logger): void {
        this._log('debug', logger);
    }

    /** @inheritDoc */
    logInfo(logger?: Logger): void {
        this._log('info', logger);
    }

    /** @inheritDoc */
    logTrace(logger?: Logger): void {
        this._log('trace', logger);
    }

    // endregion log

    // region flags
    $list<T extends T2 | string = T2 | string>(): Array<T> {
        if (this[LY_ERROR_FLAGS] === undefined) {
            return [];
        }
        return Array.from(this[LY_ERROR_FLAGS].values()) as Array<T>;
    }

    $append<T extends T2 | string = T2 | string>(key: T): boolean {
        if (this[LY_ERROR_FLAGS] === undefined) {
            this[LY_ERROR_FLAGS] = new Set<T2>();
        }
        else if (this[LY_ERROR_FLAGS].has(key as T2)) {
            return false;
        }
        this[LY_ERROR_FLAGS].add(key as T2);
        return true;
    }

    $remove<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean {
        if (this[LY_ERROR_FLAGS] === undefined) {
            return false;
        }
        if ( !this[LY_ERROR_FLAGS].has(key as T2)) {
            return false;
        }
        this[LY_ERROR_FLAGS].delete(key as T2);
        if (this[LY_ERROR_FLAGS].size === 0) {
            delete this[LY_ERROR_FLAGS];
        }
        return true;
    }

    $has<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean {
        if (this[LY_ERROR_FLAGS] === undefined) {
            return false;
        }
        return this[LY_ERROR_FLAGS].has(key as T2);
    }

    // endregion flags

    // region methods

    /** @inheritDoc */
    $copyProperties(source: Error): void {
        if ( !(source instanceof Error)) {
            return;
        }
        if ( !isObj(this.params)) {
            this.params = {};
        }
        if (source instanceof LeyyoError) {
            for (const [k, v] of Object.entries(source)) {
                if ( !LEYYO_ERROR_FIELDS.includes(k as StrKey<LeyyoErrorLike>) && (typeof k === 'string') && !['symbol', 'function', 'undefined'].includes(typeof v)) {
                    optAdd(this.params, k, v);
                }
                if (isFilledObj(source.params)) {
                    optAppend(this.params, source.params);
                }
            }
        }
        else {
            for (const [k, v] of Object.entries(source)) {
                if ( !ERROR_FIELDS.includes(k as StrKey<Error>) && (typeof k === 'string') && !['symbol', 'function', 'undefined'].includes(typeof v)) {
                    optAdd(this.params, k, v);
                }
            }
        }
    }

    // endregion methods

    // region modes
    get $back(): LeyyoErrorLike {
        return this;
    }

    get $secure(): LeyyoErrorSecure {
        return this;
    }

    // endregion modes
}
