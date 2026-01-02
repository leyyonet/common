import type {Fnc, InitLike, Obj, ShiftMain, ShiftSecure} from "../shared";
import type {HookDefinedProvider} from "../hook";

export interface FqnCommonLike extends ShiftSecure<FqnCommonSecure> {
    name(target: any): string;

    exists(target: any): boolean;

    register(name: string, target: any, type: FqnStereoType, pckName: string): void;

    addHook(target: Function | Object, callback: FqnHookCommon): boolean;


    get isProper(): boolean;
}


export interface FqnCommonSecure extends ShiftMain<FqnCommonLike>, InitLike {
    $runHooks(fn: Fnc | Obj, name: string): void;
    $appendHook(target: Function | Object, callback: FqnHookCommon): void;
}

export interface FqnDefinedProvider extends HookDefinedProvider {
    exists(target: any): boolean;

    name(target: any): string;

    register(name: string, target: any, type: FqnStereoType, pckName: string): void;
}

export type FqnStereoType = 'class' | 'function' | 'enum' | 'literal';
export type FqnHookCommon = (name: string) => void;
