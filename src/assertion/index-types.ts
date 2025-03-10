import {Leyyo} from "../leyyo";
import {Arr, OneOrMore, ShiftMain, ShiftSecure} from "../aliases";
import {TypeOpt} from "../to";

export interface CommonAssertion extends ShiftSecure<CommonAssertionSecure>{

    raise(opt: string, value?: any, indicator?: string, def?: string): void;
    raise(opt: AssertionCallback, value?: any, indicator?: string, def?: string): void;
    raise(opt: AssertionOpt, value?: any, indicator?: string, def?: string): void;
    emptyFn(...params: Arr): void;
    secureJson<E = unknown>(value: unknown): E;
    realNumber(value: number, opt?: TypeOpt): number;

    notEmpty(value: unknown, message?: string): void;
    notEmpty(value: unknown, fn?: AssertionCallback): void;
    notEmpty(value: unknown, opt?: AssertionOpt): void;

    primitive(value: unknown, message?: string): void;
    primitive(value: unknown, fn?: AssertionCallback): void;
    primitive(value: unknown, opt?: AssertionOpt): void;

    value(value: unknown, message?: string): void;
    value(value: unknown, fn?: AssertionCallback): void;
    value(value: unknown, opt?: AssertionOpt): void;

    key(value: unknown, message?: string): void;
    key(value: unknown, fn?: AssertionCallback): void;
    key(value: unknown, opt?: AssertionOpt): void;

    object(value: unknown, message?: string): void;
    object(value: unknown, fn?: AssertionCallback): void;
    object(value: unknown, opt?: AssertionOpt): void;

    array(value: unknown, message?: string): void;
    array(value: unknown, fn?: AssertionCallback): void;
    array(value: unknown, opt?: AssertionOpt): void;

    func(value: unknown, message?: string): void;
    func(value: unknown, fn?: AssertionCallback): void;
    func(value: unknown, opt?: AssertionOpt): void;

    number(value: unknown, message?: string): void;
    number(value: unknown, fn?: AssertionCallback): void;
    number(value: unknown, opt?: AssertionOpt): void;

    positiveNumber(value: unknown, message?: string): void;
    positiveNumber(value: unknown, fn?: AssertionCallback): void;
    positiveNumber(value: unknown, opt?: AssertionOpt): void;

    integer(value: unknown, message?: string): void;
    integer(value: unknown, fn?: AssertionCallback): void;
    integer(value: unknown, opt?: AssertionOpt): void;

    positiveInteger(value: unknown, message?: string): void;
    positiveInteger(value: unknown, fn?: AssertionCallback): void;
    positiveInteger(value: unknown, opt?: AssertionOpt): void;

    string(value: unknown, message?: string): void;
    string(value: unknown, fn?: AssertionCallback): void;
    string(value: unknown, opt?: AssertionOpt): void;

    text(value: unknown, message?: string): string;
    text(value: unknown, fn?: AssertionCallback): string;
    text(value: unknown, opt?: AssertionOpt): string;

    clazz(value: unknown, message?: string): void;
    clazz(value: unknown, fn?: AssertionCallback): void;
    clazz(value: unknown, opt?: AssertionOpt): void;

    date(value: unknown, message?: string): void;
    date(value: unknown, fn?: AssertionCallback): void;
    date(value: unknown, opt?: AssertionOpt): void;

    boolean(value: unknown, message?: string): void;
    boolean(value: unknown, fn?: AssertionCallback): void;
    boolean(value: unknown, opt?: AssertionOpt): void;
}

export interface CommonAssertionSecure extends ShiftMain<CommonAssertion> {
    $init(leyyo: Leyyo): void;
}
export interface AssertionOpt {
    indicator?: AssertionReason|string;
    param?: string;
    where?: string;
    value?: any;
    expected?: OneOrMore<string>;
    current?: string;
    type?: string;
    [k: string]: any;
}
type AssertionReason = 'invalid.type'|'not.found'|'duplicated'|'empty'

export type AssertionCallback = () => string | AssertionOpt;

export interface AssertionBuiltResult {
    message?: string;
    params: AssertionOpt;
}