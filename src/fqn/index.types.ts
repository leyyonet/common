import {Func, InitLike, Obj, ShiftMain, ShiftSecure} from "../shared";
import {HookDefinedProvider} from "../hook";

export interface CommonFqnLike extends ShiftSecure<CommonFqnSecure> {
    name(target: any): string;

    exists(target: any): boolean;

    register(name: string, target: any, type: FqnStereoType, pckName: string): void;

    addHook(target: Function | Object, callback: CommonFqnHook): boolean;


    get isProper(): boolean;
}


export interface CommonFqnSecure extends ShiftMain<CommonFqnLike>, InitLike {
    $runHooks(fn: Func | Obj, name: string): void;
    $appendHook(target: Function | Object, callback: CommonFqnHook): void;
}

export interface FqnDefinedProvider extends HookDefinedProvider {
    exists(target: any): boolean;

    name(target: any): string;

    register(name: string, target: any, type: FqnStereoType, pckName: string): void;
}

export type FqnStereoType = 'class' | 'function' | 'enum' | 'literal';
export type CommonFqnHook = (name: string) => void;
