import {
    Dict,
    EnumAlt,
    EnumLiteral,
    EnumMap,
    Func,
    InitLike,
    KeyValue,
    Obj,
    ShiftMain,
    ShiftSecure
} from "../shared";
import {DevOpt} from "../developer";
import {WeakTrue} from "./weak-true";
import {WeakFalse} from "./weak-false";
import {List} from "./list";

export interface CommonToLike extends ShiftSecure<CommonToSecure> {
    // region types
    anyStrict<T = any>(value: any, opt?: ToOptAny): T;
    any<T = any>(value: any, opt?: ToOptAny, notNull?: boolean): T;

    booleanStrict(value: any, opt?: ToOptAny): boolean;
    boolean(value: any, opt?: ToOptAny, notNull?: boolean): boolean;

    dateStrict(value: any, opt?: ToOptAny): Date;
    date(value: any, opt?: ToOptAny, notNull?: boolean): Date;

    enumerationStrict<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: ToOpt, alt?: EnumAlt<E>): E;
    enumeration<E extends KeyValue = KeyValue>(value: any, map: EnumMap<E>, opt?: ToOpt, alt?: EnumAlt<E>, notNull?: boolean): E;

    literalStrict<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E> | any, opt?: ToOpt, alt?: EnumAlt<E>): E;
    literal<E extends KeyValue = KeyValue>(value: any, items: EnumLiteral<E> | any, opt?: ToOpt, alt?: EnumAlt<E>, notNull?: boolean): E;

    floatStrict(value: any, opt?: ToOptAny): number;
    float(value: any, opt?: ToOptAny, notNull?: boolean): number;

    funcStrict<F extends Func = Func>(value: any, opt?: ToOptAny): F;
    func<F extends Func = Func>(value: any, opt?: ToOptAny, notNull?: boolean): F;

    integerStrict(value: any, opt?: ToOptAny): number;
    integer(value: any, opt?: ToOptAny, notNull?: boolean): number;

    stringStrict(value: any, opt?: ToOptAny): string;
    string(value: any, opt?: ToOptAny, notNull?: boolean): string;

    textStrict(value: any, opt?: ToOptAny): string;
    text(value: any, opt?: ToOptAny, notNull?: boolean): string;

    // endregion types


    // region objects

    arrayStrict<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Array<V>;
    arrayStrictNotEmpty<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Array<V>;
    arrayNotEmpty<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Array<V>;
    array<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>, notNull?: boolean): Array<V>;

    setStrict<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Set<V>;
    setStrictNotEmpty<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Set<V>;
    setNotEmpty<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>): Set<V>;
    set<V = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<V>, notNull?: boolean): Set<V>;


    listStrict<T = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<T>): List<T>;
    listStrictNotEmpty<T = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<T>): List<T>;
    listNotEmpty<T = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<T>): List<T>;
    list<T = any>(value: any, opt?: ToOptAny, itemFn?: ToSubIndexFnLambda<T>, notNull?: boolean): List<T>;

    objectStrict<O extends Obj = Obj>(value: any, opt?: ToOptAny): O;
    object<O extends Obj = Obj>(value: any, opt?: ToOptAny, notNull?: boolean): O;

    dictStrict<V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<string>): Dict<V>;
    dictStrictNotEmpty<V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<string>): Dict<V>;
    dictNotEmpty<V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<string>): Dict<V>;
    dict<V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<string>, notNull?: boolean): Dict<V>;

    mapStrict<K = any, V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<K>): Map<K, V>;
    mapStrictNotEmpty<K = any, V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<K>): Map<K, V>;
    mapNotEmpty<K = any, V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<K>): Map<K, V>;
    map<K = any, V = any>(value: any, opt?: ToOptAny, valueFn?: ToSubKeyFnLambda<V>, keyFn?: ToSubIndexFnLambda<K>, notNull?: boolean): Map<K, V>;

    // endregion objects

}

export interface CommonToSecure extends ShiftMain<CommonToLike>, InitLike {
    $runOpt(opt: ToOptAny): ToOpt;
    $runFn<T = any>(fn: Func, value: Func, opt?: ToOpt): T;
    $errorOrLog(opt: ToOptAny, extra: ToOpt, e?: Error): any;
    $unexpectedError<T = any>(value: unknown, expected: Array<string>, opt?: ToOpt): T;
    $nullError<T = any>(opt?: ToOpt): T;
    $emptyError<T = any>(kind: string, opt?: ToOpt): T;
    $inEnumMap<T extends KeyValue = KeyValue>(value: unknown, map: Dict<T>): T;
    $inEnumArray<T extends KeyValue = KeyValue>(value: unknown, arr: Array<T>): T;
    $inEnumAlteration<T extends KeyValue = KeyValue>(value: unknown, alt: Dict<T>): T;
    $realNumber(value: number, opt?: ToOpt): number;
}

export type ToOptAny = ToOpt | ToOptLambda;

export type ToOptLambda = () => ToOpt;

export interface ToOpt extends DevOpt {
    silent?: true;
}

export type ToSubKeyFnLambda<T = unknown> = (value: unknown, key: string, opt?: ToOptAny) => T;
export type ToSubIndexFnLambda<T = unknown> = (value: unknown, index: number, opt?: ToOptAny) => T;

/**
 * Weak Boolean
 * */
export type WeakBoolean = WeakTrue & WeakFalse;
