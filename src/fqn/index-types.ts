import {FqnStereoType, InitLike, ShiftMain, ShiftSecure} from "../shared";

export interface CommonFqn extends ShiftSecure<CommonFqnSecure> {
    name(value: any): string;

    register(value: any, type: FqnStereoType, pckName: string): void;
}


export type CommonFqnSecure = ShiftMain<CommonFqn> & InitLike;

