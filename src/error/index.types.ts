import type {Dict, InitLike, ShiftMain, ShiftSecure} from "../shared";
import type {ExceptionLike} from "../exception";
import type {HookDefinedProvider} from "../hook";

export interface ErrorCommonLike extends ShiftSecure<ErrorCommonSecure> {
    register(cls: Function): void;

    build(e: Error | string): ExceptionLike;

    afterCreate(e: ExceptionLike): void;

    causedBy(e: Error | string): ExceptionLike;

    initSign(err: Error): boolean;

    addSign(err: Error, ...keys: Array<string>): boolean;

    getSign(err: Error): Array<string>;

    removeSign(err: Error, ...keys: Array<string>): boolean;

    hasSign(err: Error, key: string): boolean;

    toObject(e: Error, ...omittedFields: Array<string>): Dict;

    buildStack(e: Error): void;

    copyStack(exception: ExceptionLike, error: Error): void;

    initOmit(clz: Function): boolean;

    addOmit(clz: Function, ...properties: Array<string>): boolean;

    getOmit(clz: Function): Array<string>;

    inheritOmit(clz: Function): Array<string>;
}


export type ErrorCommonSecure = ShiftMain<ErrorCommonLike> & InitLike;

export interface ErrorDefinedProvider extends HookDefinedProvider {
    register(exception: ExceptionLike): void;

    build?(e: Error | string): ExceptionLike;

    afterCreate?(e: ExceptionLike): void;

    causedBy?(e: Error | string): ExceptionLike;

    initSign?(err: Error): boolean;

    addSign?(err: Error, ...keys: Array<string>): boolean;

    getSign?(err: Error): Array<string>;

    removeSign?(err: Error, ...keys: Array<string>): boolean;

    hasSign?(err: Error, key: string): boolean;

    toObject?(e: Error, ...omittedFields: Array<string>): Dict;

    buildStack?(e: Error): void;

    copyStack?(exception: ExceptionLike, error: Error): void;

    initOmit?(clz: Function): boolean;

    addOmit?(clz: Function, ...properties: Array<string>): boolean;

    getOmit?(clz: Function): Array<string>;

    inheritOmit?(clz: Function): Array<string>;
}
