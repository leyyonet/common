import {CommonFqnHook, FqnStereoType, InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface CommonFqnLike extends ShiftSecure<CommonFqnSecure> {
    name(target: any): string;

    exists(target: any): boolean;

    register(name: string, target: any, type: FqnStereoType, pckName: string): void;

    addHook(target: Function | Object, callback: CommonFqnHook): boolean;

    get isProper(): boolean;
}


export type CommonFqnSecure = ShiftMain<CommonFqnLike> & InitLike;

