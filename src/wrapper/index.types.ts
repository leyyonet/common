import type {ClassLike, Fnc, InitLike, Obj, ShiftMain, ShiftSecure} from "../shared";

export type WrapType = 'class'|'function'|'instance'|'string';
export interface WrapperCommonLike extends ShiftSecure<WrapperCommonSecure> {

    ofClass(clazz: ClassLike): WrapLike<ClassLike>;
    ofFunction(func: Fnc): WrapLike;
    ofString(name: string): WrapLike<string>;
    ofInstance(instance: Obj): WrapLike<Obj>;

    is(wrap: any): boolean;
    isClass(wrap: any): boolean;
    isFunction(wrap: any): boolean;
    isString(wrap: any): boolean;
    isInstance(wrap: any): boolean;

    asClass(wrap: any): ClassLike;
    asFunction<F extends Fnc = Fnc>(wrap: any): F;
    asString(wrap: any): string;
    asInstance<I extends Obj = Obj>(wrap: any): I;

    type(wrap: any): WrapType;
    value<V extends ClassLike|Fnc|string|Obj = Fnc>(wrap: WrapLike<V>): V;
}

export interface WrapLike<V extends ClassLike|Fnc|string|Obj = Fnc> {
    readonly value: V;
    readonly type: WrapType;
}
/**
 * Secure assertion methods
 * */
export interface WrapperCommonSecure extends ShiftMain<WrapperCommonLike>, InitLike {
    $create<V extends ClassLike|Fnc|string|Obj = Fnc>(type: WrapType, value: V): WrapLike<V>;
}
