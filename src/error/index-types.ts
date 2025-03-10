import {Abstract, ClassLike, Dict, InitLike, ShiftMain, ShiftSecure} from "../aliases";
import {Exception} from "./exception";
import {CommonCallbackDefined} from "../callback";

export interface CommonError extends ShiftSecure<CommonErrorSecure> {
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

    copyStack(exception: Exception, error: Error): void;

    initOmit(clz: Function): boolean;

    addOmit(clz: Function, ...properties: Array<string>): boolean;

    getOmit(clz: Function): Array<string>;

    inheritOmit(clz: Function): Array<string>;
}

export interface CommonErrorCb extends CommonCallbackDefined {
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

    copyStack?(exception: Exception, error: Error): void;

    initOmit?(clz: Function): boolean;

    addOmit?(clz: Function, ...properties: Array<string>): boolean;

    getOmit?(clz: Function): Array<string>;

    inheritOmit?(clz: Function): Array<string>;
}

export interface CommonErrorSecure extends ShiftMain<CommonError>, InitLike {
}

export interface ExceptionStackLine {
    file?: string;
    method?: string;
    line?: number;
    column?: number;
    // arguments?: Array<unknown>;
}

export interface ExceptionParamsAppend extends Dict {
    indicator?: string;
}

export interface ExceptionLike extends Error, ShiftSecure<ExceptionSecure> {
    get params(): Dict;

    causedBy(e: Error | string): this;

    with(clazz: ClassLike): this;

    with(instance: Abstract<any>): this;

    with(name: string): this;

    with(value: any): this;

    appendParams(params: ExceptionParamsAppend, ignoreExisting?: boolean): this;

    log(req?: unknown): this;

    raise(throwable?: boolean, req?: unknown): this;

    toObject(...omittedFields: Array<string>): Dict;

    toJSON(): Dict;
}

export interface ExceptionSecure extends ShiftMain<ExceptionLike> {
    $setName(name: string): this;

    $hasSign(key: string): boolean;

    $listSigns(): Array<string>;

    $addSign(...keys: Array<string>): boolean;

    $removeSign(...keys: Array<string>): boolean;
}