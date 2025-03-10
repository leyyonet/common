import {Abstract, ClassLike, Dict, ShiftMain, ShiftSecure} from "../shared";

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