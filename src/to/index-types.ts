import {Dict, InitLike, KeyValue, OneOrMore, ShiftMain, ShiftSecure} from "../aliases";
import {AssertionOpt} from "../assertion";

export interface CommonTo extends ShiftSecure<CommonToSecure> {
    // region utility
    runFn<T = unknown>(fn: Function, value: Function, opt?: ToTypeOpt): T;

    raiseInvalidValue<T = unknown>(value: unknown, expected: OneOrMore<string>, opt?: ToTypeOpt, params?: Dict): T;

    // endregion utility

    // region types
    any(value: unknown, opt?: ToTypeOpt): unknown;

    array<T = unknown>(value: unknown, opt?: ToTypeArrayOpt): Array<T>;

    boolean(value: unknown, opt?: ToTypeOpt): boolean;

    clazz(value: unknown, opt?: ToTypeOpt): string;

    date(value: unknown, opt?: ToTypeOpt): Date;

    enumeration<T extends KeyValue = KeyValue>(value: unknown, opt?: ToTypeEnumOpt<T>): T;

    float(value: unknown, opt?: ToTypeOpt): number | null;

    func<T = Function>(value: unknown, opt?: ToTypeOpt): T | null;

    integer(value: unknown, opt?: ToTypeOpt): number | null;

    object<T = unknown>(value: unknown, opt?: ToTypeObjectOpt): Dict<T>;

    dict<T = unknown>(value: unknown, opt?: ToTypeObjectOpt): Dict<T>;

    string(value: unknown, opt?: ToTypeOpt): string;

    text(value: unknown, opt?: ToTypeOpt): string;

    // endregion types
}

export interface CommonToSecure extends ShiftMain<CommonTo>, InitLike {
}

export interface ToTypeOpt extends AssertionOpt {
    silent?: true;
    children?: unknown;
}

export type ToTypeFnLambda<T = unknown, O extends ToTypeOpt = ToTypeOpt> = (value: unknown, opt?: O) => T;

export interface ToTypeChildOpt<T = unknown> extends ToTypeOpt {
    fn?: ToTypeFnLambda<T>;
}

export interface ToTypeArrayChildOpt<V extends ToTypeChildOpt = ToTypeChildOpt> extends Dict<ToTypeChildOpt> {
    value?: V;
}

export interface ToTypeArrayOpt<V extends ToTypeChildOpt = ToTypeChildOpt> extends ToTypeOpt {
    children?: ToTypeArrayChildOpt<V>;
}

export interface ToTypeDictChildOpt<K extends ToTypeChildOpt = ToTypeChildOpt, V extends ToTypeChildOpt = ToTypeChildOpt> extends Record<string, ToTypeChildOpt> {
    key?: K;
    value?: V;
}

export interface ToTypeObjectOpt<K extends ToTypeChildOpt = ToTypeChildOpt, V extends ToTypeChildOpt = ToTypeChildOpt> extends ToTypeOpt {
    children?: ToTypeDictChildOpt<K, V>;
}

export interface ToTypeEnumOpt<E extends KeyValue = KeyValue> extends ToTypeOpt {
    map: EnumerationMap<E> | EnumerationArray<E>;
    alt?: EnumerationAlt<E>;
}

export type EnumerationMap<E extends KeyValue = KeyValue> = Dict<E>;
export type EnumerationAlt<E extends KeyValue = KeyValue> = Dict<E>;
export type EnumerationArray<E extends KeyValue = KeyValue> = Array<E>;
