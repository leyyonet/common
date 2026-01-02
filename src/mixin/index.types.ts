import type {InitLike, Obj, ShiftMain, ShiftSecure} from "../shared";

export type PickPredicate = (value: unknown) => boolean;

export interface MixinCommonLike extends ShiftSecure<MixinCommonSecure> {


    mergeExisting<T extends Obj = Obj>(host: Partial<T>, source: Partial<T>, ...omittedFields: Array<keyof T | string>): void;
    merge<T extends Obj = Obj>(target: Partial<T>, ...sources: Array<Partial<T>>): Partial<T>;
    overrideExisting<T extends Obj = Obj>(host: Partial<T>, source: Partial<T>, ...omittedFields: Array<keyof T | string>): void;
    override<T extends Obj = Obj>(target: Partial<T>, ...sources: Array<Partial<T>>): Partial<T>;

    omitSymbol<T extends Obj = Obj>(object: T): Partial<T>
    omitUndefined<T extends Obj = Obj>(object: T): Partial<T>;
    omitEmpty<T extends Obj = Obj>(object: T): Partial<T>;
    omit<T extends Obj = Obj>(object: T, keys: Array<keyof T | string>): Partial<T>;
    omit<T extends Obj = Obj>(object: T, predicate: PickPredicate): Partial<T>;
    pick<T extends Obj = Obj>(object: T, keys: Array<keyof T | string>): Partial<T>;
    pick<T extends Obj = Obj>(object: T, predicate: PickPredicate): Partial<T>;
    pickInverse<T extends Obj = Obj>(object: T, keys: Array<keyof T | string>): Partial<T>;
    pickInverse<T extends Obj = Obj>(object: T, predicate: PickPredicate): Partial<T>;
}
export interface MixinCommonSecure extends ShiftMain<MixinCommonLike>, InitLike {
}
