import {Dict, KeyValue, OneOrMore, ShiftMain, ShiftSecure} from "./index-aliases";
import {Exception, ExceptionLike} from "../exception";
import {Severity, StorageType} from "../literal";

// region assertion
export interface AssertionOpt {
    indicator?: AssertionReason | string;
    param?: string;
    where?: string;
    value?: any;
    expected?: OneOrMore<string>;
    current?: string;
    type?: string;

    [k: string]: any;
}

type AssertionReason = 'invalid.type' | 'not.found' | 'duplicated' | 'empty'

export type AssertionCallback = () => string | AssertionOpt;

export interface AssertionBuiltResult {
    message?: string;
    params: AssertionOpt;
}

// endregion assertion

// region hook
export interface HookAttachedCallback {
    initialization?: true,
    fn: Function;
}

export interface $HookDefinedProvider extends HookDefinedProvider {
    producer: Function;
}

export interface HookDefinedProvider {
    proper: boolean;
}

export interface HookWaitingProviderItem {
    consumer: Function;
    callback: HookDefinedProviderLambda;
}

export type HookDefinedProviderLambda<T extends HookDefinedProvider = HookDefinedProvider> = (instance: T) => void;
// endregion hook

// region fqn
export interface FqnDefinedProvider extends HookDefinedProvider {
    exists(target: any): boolean;

    name(target: any): string;

    register(name: string, target: any, type: FqnStereoType, pckName: string): void;
}

export type FqnStereoType = 'class' | 'function' | 'enum' | 'literal';
export type CommonFqnHook = (name: string) => void;
// endregion fqn

// region error
export interface ErrorDefinedProvider extends HookDefinedProvider {
    register(exception: ExceptionLike): void;

    build?(e: Error | string): ExceptionLike;

    afterCreate?(e: ExceptionLike): void;

    causedBy?(e: Error | string): ExceptionLike;

    initSign?(err: Error): boolean;

    addSign?(err: Error, ...keys: Array<string>): boolean;

    getSign?(err: Error): Array<string>;

    removeSign?(err: Error, ...keys: Array<string>): boolean;

    hasSign?(err: Error, key: string): boolean;

    toObject?(e: Error, ...omittedFields: Array<string>): Dict;

    buildStack?(e: Error): void;

    copyStack?(exception: Exception, error: Error): void;

    initOmit?(clz: Function): boolean;

    addOmit?(clz: Function, ...properties: Array<string>): boolean;

    getOmit?(clz: Function): Array<string>;

    inheritOmit?(clz: Function): Array<string>;
}

// endregion error


// region log
export interface LogDefinedProvider extends HookDefinedProvider {
    create?(clazz: Object | Function | string): Logger;

    apply?(line: LogLine): void;

    check?<T>(line: LogLineEnhanced<T>): void;

    print<T>(line: LogLineEnhanced<T>): void;
}

export interface LogConsumer {
    apply(line: LogLine): void;
}

export interface LogLine {
    severity: Severity;
    message: string | Error;
    holder?: string;
    params?: Dict;
}

export interface LogLineEnhanced<L = Dict> extends LogLine {
    time?: Date;
    locals?: L;
}

export interface Logger extends ShiftSecure<LoggerSecure> {
    error(message: string, params?: any): void;

    error(error: Error, params?: any): void;

    error(whatever: any, params?: any): void;

    warn(message: string, params?: any): void;

    warn(error: Error, params?: any): void;

    warn(whatever: any, params?: any): void;

    info(message: string, params?: any): void;

    info(error: Error, params?: any): void;

    info(whatever: any, params?: any): void;

    log(message: string, params?: any): void;

    log(error: Error, params?: any): void;

    log(whatever: any, params?: any): void;

    trace(message: string, params?: any): void;

    trace(error: Error, params?: any): void;

    trace(whatever: any, params?: any): void;

    debug(message: string, params?: any): void;

    debug(error: Error, params?: any): void;

    debug(whatever: any, params?: any): void;
}

export interface LoggerSecure extends ShiftMain<Logger> {
    get $clazz(): Function;

    get $name(): string;

    $assert(error: Error, indicator: string, params?: unknown): void;

    $setMethod(method: Severity, lambda?: LoggerLambda): void;
}

export type LoggerLambda = (whatever: any, params?: any) => void;
// endregion log

// region storage

/**
 * Storage size dictionary which in corresponding type
 * */
export type StorageItem = Dict<number>;

/**
 * Storage export dictionary which includes items
 * */
export type StorageDetail = Record<StorageType, StorageItem>;
// endregion storage

// region to
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
// endregion to