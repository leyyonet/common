import {Dict, InitLike, ShiftMain, ShiftSecure} from "../shared";
import {ExceptionLike} from "../exception";

export interface CommonErrorLike extends ShiftSecure<CommonErrorSecure> {
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


export type CommonErrorSecure = ShiftMain<CommonErrorLike> & InitLike;

