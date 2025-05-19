import {InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface CommonSystemLike extends ShiftSecure<CommonSystemSecure> {
    isSysFunction(method: string): boolean;

    isSysClass(clazz: string | Function): boolean;
}


export type CommonSystemSecure = ShiftMain<CommonSystemLike> & InitLike;

