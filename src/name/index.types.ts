import {ClassLike, Func, InitLike, Obj, ShiftMain, ShiftSecure} from "../shared";
import {Logger} from "../log";
import {DevOpt} from "../developer";
import {CommonFqnHook, CommonFqnLike} from "../fqn";

export interface CommonNameLike extends ShiftSecure<CommonNameSecure> {
    /**
     * Copies function name
     * */
    copy(source: Func | ClassLike, target: Func | ClassLike): void;

    /**
     * Sets function name, especially for arrow functions or proxied class
     * */
    set(target: Func | ClassLike, name: string): void;

    /**
     * Validates fqn or function name
     * */
    validate(value: string, hasPackage?: boolean): void;

    /**
     * Builds anonymous name
     * */
    anonymous(type?: string, counter?: number): string;
}
export interface CommonNameSecure extends ShiftMain<CommonNameLike>, InitLike {
}
