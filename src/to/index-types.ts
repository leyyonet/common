import {Dict, KeyValue, OneOrMore, ShiftMain, ShiftSecure} from "../aliases";
import {Leyyo} from "../leyyo";
import {AssertionOpt} from "../assertion";

export interface CommonTo extends ShiftSecure<CommonToSecure> {
    // region utility
    runFn<T = unknown>(fn: Function, value: Function, opt?: TypeOpt): T;
    raiseInvalidValue<T = unknown>(value: unknown, expected: OneOrMore<string>, opt?: TypeOpt, params?: Dict): T;
    // endregion utility

    // region types
    any(value: unknown, opt?: TypeOpt): unknown;
    array<T = unknown>(value: unknown, opt?: TypeArrayOpt): Array<T>;
    boolean(value: unknown, opt?: TypeOpt): boolean;
    clazz(value: unknown, opt?: TypeOpt): string;
    date(value: unknown, opt?: TypeOpt): Date;
    enumeration<T extends KeyValue = KeyValue>(value: unknown, opt?: TypeEnumOpt<T>): T;
    float(value: unknown, opt?: TypeOpt): number|null;
    func<T = Function>(value: unknown, opt?: TypeOpt): T|null;
    integer(value: unknown, opt?: TypeOpt): number|null;
    object<T = unknown>(value: unknown, opt?: TypeObjectOpt): Dict<T>;
    dict<T = unknown>(value: unknown, opt?: TypeObjectOpt): Dict<T>;
    string(value: unknown, opt?: TypeOpt): string;
    text(value: unknown, opt?: TypeOpt): string;
    // endregion types
}
export interface CommonToSecure extends ShiftMain<CommonTo> {
    $init(leyyo: Leyyo): void;
}
export interface TypeOpt extends AssertionOpt {
    silent?: true;
    children?: unknown;
}
export type TypeFnLambda<T = unknown, O extends TypeOpt = TypeOpt> = (value: unknown, opt?: O) => T;
export interface TypeChildOpt<T = unknown> extends TypeOpt {
    fn?: TypeFnLambda<T>;
}

export interface TypeArrayChildOpt<V extends TypeChildOpt = TypeChildOpt> extends Dict<TypeChildOpt> {
    value?: V;
}
export interface TypeArrayOpt<V extends TypeChildOpt = TypeChildOpt> extends TypeOpt {
    children?: TypeArrayChildOpt<V>;
}
export interface TypeDictChildOpt<K extends TypeChildOpt = TypeChildOpt, V extends TypeChildOpt = TypeChildOpt> extends Record<string, TypeChildOpt> {
    key?: K;
    value?: V;
}
export interface TypeObjectOpt<K extends TypeChildOpt = TypeChildOpt, V extends TypeChildOpt = TypeChildOpt> extends TypeOpt {
    children?: TypeDictChildOpt<K, V>;
}

export interface TypeEnumOpt<E extends KeyValue = KeyValue> extends TypeOpt {
    map: EnumerationMap<E>;
    alt?: EnumerationAlt<E>;
}
export type EnumerationMap<E extends KeyValue = KeyValue> = Dict<E>;
export type EnumerationAlt<E extends KeyValue = KeyValue> = Dict<E>;
