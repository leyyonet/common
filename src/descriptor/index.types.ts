import type {ClassLike, Fnc, InitLike, Obj, ShiftMain, ShiftSecure} from "../shared";

export interface DescriptorCommonLike extends ShiftSecure<DescriptorCommonSecure> {
    sign(fn: Fnc | ClassLike): void;

    isSigned(fn: Fnc | ClassLike): boolean;

    sym(...values: Array<string>): symbol;
    symName(sym: symbol): string;
    getValue<T = any>(target: Fnc | Obj, key: string | symbol): T;
    has(target: Fnc | Obj, key: string | symbol): boolean;

    get<T = any>(target: Fnc | Obj, key: string | symbol, notSystem?: boolean): PropDescriptor<T>;
    save<T = any>(target: Fnc | Obj, key: string | symbol, value: T, notSystem?: boolean): boolean;
    remove(target: Fnc | Obj, key: string | symbol, notSystem?: boolean): boolean;
}

/**
 * Secure assertion methods
 * */
export interface DescriptorCommonSecure extends ShiftMain<DescriptorCommonLike>, InitLike {
    $isNot<T = any>(target: Fnc | Obj, key: string | symbol): boolean;
}

export interface PropDescriptor<T> extends PropertyDescriptor {
    value?: T;

    get(): T;

    set(value: T): void;
}
