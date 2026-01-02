import type {ErrorCommonLike, ErrorCommonSecure, ErrorDefinedProvider} from "./index.types";
import {LeyyoHookCommon, type LeyyoLike} from "../leyyo";
import type {Dict, Keys} from "../shared";
import {
    AssertionException,
    CausedException,
    DeveloperException,
    Exception,
    type ExceptionLike,
    InvalidValueException,
    MultipleException
} from "../exception";
import {FQN} from "../internal";

// noinspection JSUnusedLocalSymbols
export class ErrorCommon implements ErrorCommonLike, ErrorCommonSecure {

    constructor(private lyy: LeyyoLike) {
    }

    get $back(): ErrorCommonLike {
        return this;
    }

    $init(): void {

        this.lyy.$secure
            .$earlyRun(() => {
            Exception.$setLeyyo(this.lyy);
        })
            .$lazyRun(() => {
            const fields = ['build', 'afterCreate', 'causedBy', 'toObject', 'buildStack', 'copyStack',
                'initSign', 'addSign', 'getSign', 'removeSign', 'hasSign',
                'initOmit', 'addOmit', 'getOmit', 'inheritOmit'] as Keys<ErrorDefinedProvider>;

            const rec = {proper: false} as ErrorDefinedProvider;
            fields.forEach(field => {
                rec[field] = this[field];
            });

            // define itself temporarily for error operations
                this.lyy.hook.defineProvider<ErrorDefinedProvider>(LeyyoHookCommon.errorAttached, ErrorCommon, rec);

            // when new error provider is defined, replace all common methods
                this.lyy.hook.whenProviderDefined<ErrorDefinedProvider>(LeyyoHookCommon.errorAttached, ErrorCommon, (ins) => {
                fields.forEach(field => {
                    if (typeof ins[field] === 'function') {
                        this[field] = ins[field];
                    }
                });
            });
        })
            .$lazyRun(() => {
                this.lyy.fqn.register(null, ErrorCommon, 'class', FQN);
            [Exception, AssertionException, CausedException, DeveloperException, MultipleException, InvalidValueException].forEach(cls => {
                this.lyy.fqn.register(null, cls, 'class', FQN);
                this.lyy.error.register(cls);
            });
        });
    }

    get $secure(): ErrorCommonSecure {
        return this;
    }

    addOmit(clz: Function, ...properties: Array<string>): boolean {
        return false;
    }

    addSign(err: Error, ...keys: Array<string>): boolean {
        return false;
    }

    afterCreate(e: ExceptionLike): void {
        e.$secure.$setName(e.constructor.name);
    }

    register(cls: Function): void {
        this.lyy.hook.queueForCallback(LeyyoHookCommon.errorPendingRegister, cls);
    }

    build(e: Error | string): ExceptionLike {
        if (e instanceof Exception) {
            return e;
        } else if (e instanceof Error) {
            const err = new Exception(e.message, this.toObject(e, 'message', 'stack'));
            this.copyStack(err, e);
            return err;
        } else if (typeof e === 'string') {
            return new Exception(e);
        }
        return new Exception(`Unknown error`, {...this.toObject(e), type: typeof e});
    }

    buildStack(e: Error): void {
    }

    copyStack(exception: ExceptionLike, error: Error): void {
    }

    causedBy(e: Error | string): ExceptionLike {
        return undefined;
    }

    getOmit(clz: Function): Array<string> {
        return undefined;
    }

    getSign(err: Error): Array<string> {
        return undefined;
    }

    hasSign(err: Error, key: string): boolean {
        return false;
    }

    inheritOmit(clz: Function): Array<string> {
        return undefined;
    }

    initOmit(clz: Function): boolean {
        return false;
    }

    initSign(err: Error): boolean {
        return false;
    }

    removeSign(err: Error, ...keys: Array<string>): boolean {
        return false;
    }

    toObject(e: Error, ...omittedFields: Array<string>): Dict {
        return undefined;
    }

}
