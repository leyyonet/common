import type {Arr, Describable, InitLike, OneOrMore, ShiftMain, ShiftSecure} from "../shared";
import type {Severity} from "../log";
import {EnvInstance} from "./env.instance";

export type EnvPrimitiveValue = string|number|boolean;
export type EnvLike<K extends string = string> = Record<K, EnvItem>;

export interface EnvItem {
    ota?(v: boolean): unknown;
    def?(v: unknown): unknown;
    cast?(fn: (v: unknown) => unknown): void;
    assert?(fn: (v: unknown) => void): void;
}
export interface EnvInstanceLike<K extends string = string> {

}
export interface EnvCommonLike extends ShiftSecure<EnvCommonSecure> {
    build<K extends string = string>(pck: string): EnvInstanceLike<K>;
}

/**
 * Secure assertion methods
 * */
export interface EnvCommonSecure extends ShiftMain<EnvCommonLike>, InitLike {
    $addKey(key: string, pck: string): void;
}
