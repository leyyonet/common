// noinspection JSUnusedGlobalSymbols

import {LanguageCode, LocaleCode} from "./literals";

// region basic
export type BasicType = 'undefined'|'string'|'object'|'number'|'boolean'|'function'|'symbol'|'bigint';
export type Dict<T = any> = Record<KeyValue, T>;
export type Arr<T = any> = Array<T>;
export type KeyValue = string|number;

export type Id = string | number;
export type Unknown = unknown;
export type Integer = number;
export type Float = number;
export type Boolean = boolean;
export type Enum = string; // enumeration
export type Alpha = string; // alphaType
export type String = string; // stringType
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
// endregion basic


// region function-class
interface _Func {
    readonly name?: string;
    readonly length?: number;
    bind(thisArg: any, ...args: Array<any>): any;
    apply(thisArg: any, args: Array<any>): any;
    call(thisArg: any, ...args: Array<any>): any;
}

export interface Fnc<R = any> extends _Func {
    (...args: Array<any>): R;
}
export interface AsyncFnc<R = any> extends _Func {
    (...args: Array<any>): Promise<R>;
}
export type Func<R = any> = Function | Fnc<R>;
export type Async<R = any> = Function | AsyncFnc<R>;

export interface ClassLike<T = {}> extends _Func {
    new(...args: Array<any>): T;
}
/**
 * Serialized version of another type
 */
export type Serialized<T> = {
    [P in keyof T]: T[P];
};
export type ClassOrName = ClassLike | string;
export type FuncOrName = Function | string;
/**
 * Referenced from Object
 * */
export type Obj = Object & {};
export interface Abstract<T> extends Function {
    prototype: T;
}

// endregion function-class


// region express
declare namespace Express {
    export interface Request {
        custom?: Dict;
    }
    export interface Response {
        custom?: Dict;
    }
}
// endregion express

// region entity
export interface Entity<I extends Id = Uuid> {
    id?: I;
}

export interface Pair<I extends Id = Uuid> extends Entity<I> {
    name?: string;
}
// endregion entity


// region utility
export type TypeOfMethod<T, M extends keyof T> = T[M] extends Function ? T[M] : never;
export type KeyOf<T> = keyof T;
export type Keys<T> = Array<keyof T>;
export type ValueOf<T> = T[KeyOf<T>];
export type Values<T> = Array<T[KeyOf<T>]>;
export type MaximumOneOf<T, K extends keyof T = keyof T> = K extends keyof T ? {
    [P in K]: T[K];
} & Partial<Record<Exclude<keyof T, K>, never>> : never;
export type OneOf<Obj> = ValueOf<OneOfByKey<Obj>>;
export type Xor<A, B> =
    | XorIn<A & { [K in keyof B]?: undefined }>
    | XorIn<B & { [K in keyof A]?: undefined }>;
export type Mutable<A> = {
    -readonly [K in keyof A]: A[K];
}
export type OneOrMore<T> = T | Array<T>;
export type SameType<A, T> = {
    [K in keyof A]: T;
}
type OneOnly<T, K extends keyof T> = Omit<T, Exclude<keyof T, K>> | Pick<T, K>;
type OneOfByKey<T> = { [key in keyof T]: OneOnly<T, key> };
type XorIn<T> = { [K in keyof T]: T[K] } & unknown;
// endregion utility

// region shift
export interface ShiftSecure<S extends ShiftMain<any>> {
    get $secure(): S;
}

export interface ShiftFlat<D> {
    get $flat(): D;
}

export interface ShiftMain<M extends ShiftSecure<any>> {
    get $back(): M;
}

export interface InitLike {
    $init(...args: Arr): void;
}
// endregion shift


// region json
/**
 * JSON Object
 */
export type JsonObject = { [K in string]?: JsonValue };
/**
 * JSON Array
 */
export type JsonArray = Array<JsonValue>;

/**
 * JSON Primitives
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON Values
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
// endregion json

// region i18n
/**
 * Primitive language key
 *
 * It can be language (xx), local (xx-xx) or string (not preferred)
 * */
export type I18nKey = LanguageCode | LocaleCode | string;
/**
 * Language map
 *
 * @example
 * const name = {en: "Apple", tr: "Elma"};
 *
 * */
export type I18nRaw<V = unknown> = Dict<V>;
export type I18nAny<V = unknown> = I18nRaw<V> | V;
// endregion i18n