import type {ClassLike, InitLike, OneOrMore, ShiftMain, ShiftSecure} from "../shared";
import type {Logger} from "../log";
import type {Opt} from "../opt";

export type ErrorCastType = 'leyyo' | 'silent' | 'caused';

export interface ErrorCommonLike extends ShiftSecure<ErrorCommonSecure> {
    register(cls: ClassLike, fqn?: string): void;
    castForClass<E extends LeyyoErrorLike>(clazz: ClassLike<E>, e: Error, opt?: Opt): E;
    cast(e: Error, opt?: Opt, type?: ErrorCastType): LeyyoErrorLike;
    addKnownPackage(packageName: string, shortName: string): void;
    stack(source: LeyyoErrorLike, force?: boolean): void;
}

/**
 * Stack line
 * */
export interface ErrorStackLine {
    file: string;
    method?: string;
    pos?: string;
}

export type ErrorCommonSecure = ShiftMain<ErrorCommonLike> & InitLike;
export interface LeyyoErrorLike extends Error, ShiftSecure<LeyyoErrorSecure> {
    params?: Opt;
    causedBy?: OneOrMore<Error>;
    stackTrace?: Array<ErrorStackLine>;
}
export interface LeyyoErrorSecure extends ShiftMain<LeyyoErrorLike> {
    $setName(name: string): this;
    $errorLog(logger?: Logger): void;
    $warnLog(logger?: Logger): void;
    $debugLog(logger?: Logger): void;
    $infoLog(logger?: Logger): void;
    $traceLog(logger?: Logger): void;

    $list(): Array<string>;
    $append(key: string): boolean;
    $get(key: string): Array<string>;
    $remove(key: string): boolean;
    $has(key: string): boolean;

}
