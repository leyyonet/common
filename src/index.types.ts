// noinspection JSUnusedGlobalSymbols

// region alias
import type {LogLevel} from "./enum";

export type HttpStatus = number;
// endregion alias

// region basic
export type BasicType = 'undefined' | 'string' | 'object' | 'number' | 'boolean' | 'function' | 'symbol' | 'bigint';
export type ExtendedType = BasicType
    | 'array' | 'null' | 'enum'
    | 'class'
    | 'empty' | 'text'
    | 'nan' | 'integer'
    | 'date' | 'map' | 'set' | 'list';
export type KeyValue = string | number;
export type AnyKey = string | number | symbol;
export type Obj = Object & {};
export type Dict<T = unknown> = Record<KeyValue, T>;
export type Arr<T = unknown> = Array<T>;
// endregion basic

// region alias
export type Id = string | number;
export type Integer = number;
export type Float = number;
export type Alpha = string; // alphaType
export type Text = string; // trimmed string
export type Digit = string; // digitType, 0-9
export type Title = string; //Single-line clear-text (no html)
export type Description = string; //Multi-line clear-text (no html)
export type RichText = string; // multi-line rich text with html tags
export type Uuid = string;
export type Host = string;
export type Url = string;
export type Email = string;
export type Folder = string;
export type Timestamp = number;
export type IsoDatetime = string; // yyyy-mm-ddThh:mm:ii.eeeZ
export type IsoDate = string; // yyyy-mm-dd
export type IsoTime = string; // hh:mm:ii.eeeZ
// endregion alias

// region function-class
export type Fnc<R = unknown> = ((...args: Arr) => R) & Function;
export type Async<R = unknown> = ((...args: Arr) => Promise<R>) & AsyncGeneratorFunction;

export interface Abstract<T = {}> extends Function {
    prototype: T;
    readonly name: string;
    readonly length: number;
    bind(thisArg: unknown, ...args: Arr): unknown;
    apply(thisArg: unknown, args: Arr): unknown;
    call(thisArg: unknown, ...args: Arr): unknown;
}

export interface ClassLike<T = {}> extends Abstract<T> {
    new(...args: Arr): T;
}

export type TypeOf<C = ClassLike> = C extends ClassLike<infer T> ? T : C;

// endregion function-class

// region express
export declare namespace Express {
    export interface Request {
        custom?: Dict;
    }

    export interface Response {
        custom?: Dict;
    }
}
// endregion express

// region utility
export interface Describable {
    description: string;
}
export interface Nameable {
    name: string;
}
export interface HasId {
    id?: string|number;
}

export type TypeOfMethod<T, M extends keyof T> = T[M] extends Function ? T[M] : never;
export type TypeOfFnc<F extends Fnc> = F extends (...args: Arr) => infer R ? R : never;
export type TypeOfAsync<F extends Async> = TypeOfPromise<TypeOfFnc<F>>;
export type TypeOfPromise<P> = P extends Promise<infer R> ? R : P;

/**
 * String keys of an interface
 * - Note: keyof keywords returns string|number|symbol, but it's ignore number and symbol keys
 * */
export type StrKey<T> = Extract<keyof T, string>;

/**
 * Serialized version of another type
 */
export type Serialized<T> = { [P in keyof T]: T[P]; };

/**
 * Makes mutable an interface
 *
 * @see Readonly
 * */
export type Mutable<A> = { -readonly [K in keyof A]: A[K]; }

export type KeyOf<T> = keyof T;
export type Keys<T> = Array<keyof T>;
export type ValueOf<T> = T[KeyOf<T>];
export type Values<T> = Array<T[KeyOf<T>]>;
export type OneOrMore<T> = T | Array<T>;
export type SetOrMore<T> = T | Set<T>;
// endregion utility

// region shift
/**
 * An interface which contains secure mode members and provides to shift to main mode
 * */
export interface ShiftSecure<S extends ShiftMain<any>> {

    /**
     * Shifts to secure mode
     * */
    get $secure(): S;
}

/**
 * An interface which contains main mode members and provides to shift to secure mode
 *
 * IT's so useful to hide some public members
 * - to see clean auto-completed members in IDE
 * - to indicated that secure mode members should be used in special cases
 * */
export interface ShiftMain<M extends ShiftSecure<any>> {

    /**
     * Shifts to main mode
     * */
    get $back(): M;
}

/**
 * An interface which provides to flat generic interfaces/classes to prevent verbose casting commands
 * */
export interface ShiftFlat<D> {

    /**
     * Flats current classes, or eliminate generic parameters
     * */
    get $flat(): D;
}

/**
 * Useful interface which provides initialization state for instances
 * */
export interface InitLike {

    /**
     * Initializes the instance
     * */
    $init(...args: Arr): void;
}

// endregion shift

// region enum
export type EnumMap<E extends KeyValue = KeyValue> = { [K in E]: KeyValue };
export type EnumAlt<E extends KeyValue = KeyValue> = Dict<E>;
export type EnumLiteral<E extends KeyValue = KeyValue> = Array<E>|ReadonlyArray<E>;
export type EnumData<E extends KeyValue = KeyValue> = EnumMap<E> | EnumLiteral<E>;

export type EnumType = 'map'|'literal';
export interface EnumItem extends EnumDefineOpt {
    mode: LoaderMode;
    type?: EnumType; // for lazy load, we will learn it later
    data?: EnumMap|EnumLiteral;
    alt?: EnumAlt;
    lazyData?: Promise<EnumMap|EnumLiteral>;
    lazyAlt?: Promise<EnumAlt>;
}

export interface EnumDefineOpt {
    name: string;
    fqn?: string;
    i18n?: unknown; // todo
}

export interface EnumDefineEagerOpt extends EnumDefineOpt {
    alt?: EnumAlt;
}
export interface EnumDefineLazyOpt extends EnumDefineOpt {
    lazyData: Promise<EnumMap|EnumLiteral>;
    lazyAlt?: Promise<EnumAlt>;
}
// endregion enum

// region replace or ignore property type


export type IgnoreFieldsByType<T, I> = {
    [K in keyof T]: T[K] extends I ? K : never
}[keyof T];
export type ReplaceType<T, O, N> = {
    [P in keyof T]: T[P] extends O ? N : T[P];
};
export type SameType<A, T> = {
    [K in keyof A]: T;
}


export type PickByType<T, I> = {
    [K in keyof T]: T[K] extends I ? K : never
};
export type PickKeyByType<T, I> = PickByType<T, I>[keyof T];

export type OmitByType<T, I> = {
    [K in keyof T]: T[K] extends I ? never : K;
};
export type OmitKeysByType<T, I> = OmitByType<T, I>[keyof T];

// ========================================================
// LOOK
// ========================================================

export type ValueOrCallback<T> = T | ValueCallback<T> | ValueCallbackAsync<T>;
export type ValueCallback<T> = () => T;
export type ValueCallbackAsync<T> = () => Promise<T>;


export type MaximumOneOf<T, K extends keyof T = keyof T> = K extends keyof T ? {
    [P in K]: T[K];
} & Partial<Record<Exclude<keyof T, K>, never>> : never;
export type OneOf<Obj> = ValueOf<OneOfByKey<Obj>>;
export type Xor<A, B> =
    | XorIn<A & { [K in keyof B]?: undefined }>
    | XorIn<B & { [K in keyof A]?: undefined }>;
type OneOnly<T, K extends keyof T> = Omit<T, Exclude<keyof T, K>> | Pick<T, K>;
type OneOfByKey<T> = { [key in keyof T]: OneOnly<T, key> };
type XorIn<T> = { [K in keyof T]: T[K] } & unknown;

// endregion

// region json
/**
 * JSON Object, record of `JsonValue`
 *
 * @see #JsonValue
 */
export type JsonObject = { [K in string]?: JsonValue };
/**
 * JSON Array, array of `JsonValue`
 *
 * @see #JsonValue
 */
export type JsonArray = Array<JsonValue>;

/**
 * JSON Primitive
 *
 * `OneOf`
 * @see `string`
 * @see `number`
 * @see `boolean`
 * @see `null`
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON Value
 *
 * `OneOf`
 * @see #JsonPrimitive
 * @see #JsonObject
 * @see #JsonArray
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
// endregion json

// region option
export type OptReason = 'invalid' | 'unexpected' | 'not:allowed' | 'not:found' | 'duplicated' | 'empty' | 'conflicted';

export interface Opt<R extends string = string> extends Obj {
    issue?: SetOrMore<OptReason | R | string>;
    message?: SetOrMore<string>;
    field?: string;
    param?: SetOrMore<unknown>;
    where?: SetOrMore<string>;
    value?: SetOrMore<unknown>;
    expected?: SetOrMore<ExtendedType | string>;
    type?: SetOrMore<ExtendedType | string>;
    method?: SetOrMore<string>;
    case?: SetOrMore<unknown>;
    desc?: SetOrMore<Describable | string>;
    error?: SetOrMore<{ name: string, message: string }>,
    assert?: SetOrMore<string>;

    [k: string]: unknown;
}

export type OptFn<O extends Opt = Opt> = () => O;
export type OptAny<O extends Opt = Opt> = O | OptFn<O>;
// endregion option

// region list
/**
 * Extended array interface, ie: Clearable arrays
 * */
export interface ListLike<T = unknown> extends Array<T> {

    /**
     * Clears array items, to align all iteration repositories, like Set, Map etc
     *
     * @return {number} - returns deleted count
     * */
    clear(): number;


    /**
     * Deletes given item
     *
     * @param {any} value - will be deleted record
     * @return {boolean} - is deleted?
     * */
    delete(value: T): boolean;

    /**
     * Deletes by given predicate
     *
     * @param {function} predicate - lambda expression
     * @return {boolean} - is deleted?
     * */
    deleteByLambda(predicate: ListPredicate<T>): boolean;
}

export type ListPredicate<T = unknown> = (value: T, index?: number, arr?: Array<T>) => T;
// endregion list

// region error

/**
 * Bare omit error without any property
 * */
export type OmitError = Omit<Error, 'name' | 'message' | 'stack'>;

export interface ErrorObject {
    name: string;
    message: string;
}

export interface ErrorItem extends ErrorDefineOpt {
    name: string;
    mode: LoaderMode;
    clazz?: ClassLike;
    lazyClass?: Promise<ClassLike>;
}

/**
 * Stack line
 * */
export interface ErrorStackLine {
    /**
     * File of error
     * */
    file: string;

    /**
     * Method of error
     * */
    method?: string;

    /**
     * Position of error
     * */
    pos?: string;
}

export interface LeyyoStackLike extends Error {

    /**
     * Formatted stack trace
     * */
    stackTrace?: Array<ErrorStackLine>;
}
export interface LeyyoErrorLike extends Error, LeyyoStackLike, ShiftSecure<LeyyoErrorSecure> {
    /**
     * Parameters for error
     * */
    params?: Opt;

    /**
     * Caused error
     * */
    causedBy?: OneOrMore<Error>;

    /**
     * Bind caused error
     *
     * @param {Error} err
     * @return {LeyyoErrorLike}
     * */
    causes(err: Error): this;

    /**
     * Bind holder class name
     *
     * @param {string} name - name of class
     * @param {string?} fqn - fqn
     * @return {LeyyoErrorLike}
     * */
    where(name: string, fqn?: string): this;

    /**
     * Bind holder instance
     *
     * @param {Obj} instance - this instance
     * @return {LeyyoErrorLike}
     * */
    where(instance: Obj): this;

    /**
     * Bind holder instance
     *
     * @param {function} clazz - class
     * @return {LeyyoErrorLike}
     * */
    where(clazz: ClassLike): this;

    /**
     * Alias for {@link logError}
     *
     * @param {Logger?} logger - optional bound logger
     * */
    log(logger?: Logger): void;

    /**
     * Log as `fatal`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logFatal(logger?: Logger): void;

    /**
     * Log as `error`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logError(logger?: Logger): void;

    /**
     * Log as `warn`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logWarn(logger?: Logger): void;

    /**
     * Log as `debug`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logDebug(logger?: Logger): void;

    /**
     * Log as `info`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logInfo(logger?: Logger): void;

    /**
     * Log as `trace`
     *
     * @param {Logger?} logger - optional bound logger
     * */
    logTrace(logger?: Logger): void;
}

export interface LeyyoErrorSecure extends ShiftMain<LeyyoErrorLike> {
    // region log

    // endregion log

    // region flags
    /**
     * List flags
     *
     * @return {Array<string>} - flags
     * */
    $list<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(): Array<T>;

    /**
     * Append a flag
     *
     * @param {string} key - flag key
     * @return {boolean} - is it appended?
     * */
    $append<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

    /**
     * Remove a flag
     *
     * @param {string} key - flag key
     * @return {boolean} - is it removed?
     * */
    $remove<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

    /**
     * Has a flag?
     *
     * @param {string} key - flag key
     * @return {boolean} - has it?
     * */
    $has<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

    // endregion flags

    // region methods

    /**
     * Copy source properties into target parameters
     *
     * @param {Error} source - source error
     * */
    $copyProperties(source: Error): void;

    // endregion methods

}

export type LeyyoErrorTag = 'printed' | 'sent';

export interface ErrorDefineOpt {
    /**
     * Fqn name
     * */
    fqn?: string;

    /**
     * Default error message
     * */
    message?: string;

    /**
     * Will be error emitted?
     * */
    emit?: unknown; // todo

    /**
     * Will be the error decorated for context language?
     * */
    i18n?: unknown; // todo
}

export interface ErrorDefineEagerOpt extends ErrorDefineOpt {
}

export interface ErrorDefineLazyOpt extends ErrorDefineOpt {
    name: string;
    lazyClass: Promise<ClassLike>;
}
export type ErrorStackBuilder = (err: LeyyoStackLike, force?: boolean) => void;
// endregion error

// region lifecycle
export type LifecycleStage = 'initialize' | 'print' | 'validate' | 'process' | 'clear' | 'ota-before' | 'ota-after' | 'kill';
export type LifecycleTuple = [string, Array<Fnc>];
export type LifecycleSortLambda = (map: Map<string, Array<Fnc>>) => Array<LifecycleTuple>;
// endregion lifecycle

// region exporter
export type ExporterData = Record<string, ExporterValue>;
export type ExporterValue = Record<string, unknown>;
export interface ExporterDepot {
    add(name: string, value: ExporterValue): void;
}
// endregion exporter

// region log
export interface Logger extends ShiftSecure<LoggerSecure> {

    debug(message: string, params?: any|Opt): void;
    debug(error: Error, params?: any|Opt): void;
    debug(whatever: any, params?: any|Opt): void;

    trace(message: string, params?: any|Opt): void;
    trace(error: Error, params?: any|Opt): void;
    trace(whatever: any, params?: any|Opt): void;

    info(message: string, params?: any|Opt): void;
    info(error: Error, params?: any|Opt): void;
    info(whatever: any, params?: any|Opt): void;

    warn(message: string, params?: any|Opt): void;
    warn(error: Error, params?: any|Opt): void;
    warn(whatever: any, params?: any|Opt): void;

    error(message: string, params?: any|Opt): void;
    error(error: Error, params?: any|Opt): void;
    error(whatever: any, params?: any|Opt): void;

    fatal(message: string, params?: any|Opt): void;
    fatal(error: Error, params?: any|Opt): void;
    fatal(whatever: any, params?: any|Opt): void;
}

export interface LoggerSecure extends ShiftMain<Logger> {
    get $name(): string;
    $refresh(level: LogLevel): void;
}

export interface LogItem {
    level: LogLevel;
    where?: string;
    ctx?: unknown;
    now: string;
    message: string|Error;
    params?: Opt;
    paramStr?: string;
}

export type LocalColorLevel = [boolean, string, string]; // bold, regular, light
export interface LocalColorLike {
    bold: string;
    normal: string;
    end: string;
    param: string;
    levels: Record<LogLevel, LocalColorLevel>;
}
export type LogFormatterLambda = (item: LogItem) => void;
export type LogConsumerLambda = (item: LogItem) => void;
export type LogStylerLambda = (item: LogItem) => string;

// endregion log

// region context
export type ContextFinderLambda = <T = unknown>(...p: Array<unknown>) => T;
// endregion context

// region loader
export type LoaderMode = 'eager'|'lazy';
export type LoaderLike = Array<LoaderItem>;
export type LeyyoStampLambda = () => LoaderItem;
export type LeyyoStampEmpty = () => symbol;
export type LoaderItem = ClassLike | Fnc | EnumMap | EnumLiteral | Obj | LeyyoStampLambda | LeyyoStampEmpty | LoaderLike;
// endregion loader

// region event
export type EventType = 'log'|'error:emit'|'context:finder';
// endregion event

/*

// export type StrObject<T> = {
//     [K in keyof T ]: K extends string ? K : never;
// };
// export type StrKey<T> = keyof StrObject<T>;

interface _BaseFunc {
    readonly name?: string;
    readonly length?: number;
    bind(thisArg: unknown, ...args: Array<unknown>): unknown;

    apply(thisArg: unknown, args: Array<unknown>): unknown;

    call(thisArg: unknown, ...args: Array<unknown>): unknown;
}

interface _SyncFnc<R> extends _BaseFunc {
    (...args: Array<unknown>): R;
}
interface _AsyncFnc<R> extends _BaseFunc {
    (...args: Array<unknown>): Promise<R>;
}

// export type ClassOrName = ClassLike | string;
// export type FuncOrName = Function | string;
// export type ClassOrFuncOrName = ClassLike | Function | string;
// export type ClassLike<T = {}> = (_BaseFunc & _Type<T>) | _SyncFnc<T>;
// export type AnyFnc<R = unknown> = Fnc<R> | Async<R>;

*/
