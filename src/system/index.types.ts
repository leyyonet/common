import type {InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface SystemCommonLike extends ShiftSecure<SystemCommonSecure> {
    isSysFunction(method: string): boolean;

    isSysClass(clazz: string | Function): boolean;
}


export type SystemCommonSecure = ShiftMain<SystemCommonLike> & InitLike;

