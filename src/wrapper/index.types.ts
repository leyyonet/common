import {ClassLike, Func, InitLike, Obj, ShiftMain, ShiftSecure} from "../shared";

export type WrapType = 'class'|'function'|'instance'|'string';
export interface CommonWrapperLike extends ShiftSecure<CommonWrapperSecure> {

    ofClass(clazz: ClassLike): WrapLike<ClassLike>;
    ofFunction(func: Func): WrapLike;
    ofString(name: string): WrapLike<string>;
    ofInstance(instance: Obj): WrapLike<Obj>;

    is(wrap: any): boolean;
    isClass(wrap: any): boolean;
    isFunction(wrap: any): boolean;
    isString(wrap: any): boolean;
    isInstance(wrap: any): boolean;

    asClass(wrap: any): ClassLike;
    asFunction<F extends Func = Func>(wrap: any): F;
    asString(wrap: any): string;
    asInstance<I extends Obj = Obj>(wrap: any): I;

    type(wrap: any): WrapType;
    value<V extends ClassLike|Func|string|Obj = Func>(wrap: WrapLike<V>): V;
}

export interface WrapLike<V extends ClassLike|Func|string|Obj = Func> {
    readonly value: V;
    readonly type: WrapType;
}
/**
 * Secure assertion methods
 * */
export interface CommonWrapperSecure extends ShiftMain<CommonWrapperLike>, InitLike {
    $create<V extends ClassLike|Func|string|Obj = Func>(type: WrapType, value: V): WrapLike<V>;
}