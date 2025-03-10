import {
    Dict,
    InitLike,
    KeyValue,
    OneOrMore,
    ShiftMain,
    ShiftSecure,
    ToTypeArrayOpt,
    ToTypeEnumOpt,
    ToTypeObjectOpt,
    ToTypeOpt
} from "../shared";

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
