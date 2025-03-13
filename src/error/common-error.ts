import {CommonErrorLike, CommonErrorSecure} from "./index-types";
import {LeyyoLike} from "../leyyo";
import {Dict, ErrorDefinedProvider, Keys, LY_ATTACHED_ERROR, LY_PENDING_ERROR_REGISTER} from "../shared";
import {Exception, ExceptionLike} from "../exception";
import {CommonHookLike} from "../hook";

// noinspection JSUnusedLocalSymbols
export class CommonError implements CommonErrorLike, CommonErrorSecure {
    private hook: CommonHookLike;

    get $back(): CommonErrorLike {
        return this;
    }

    $init(leyyo: LeyyoLike): void {
        this.hook = leyyo.hook;

        const fields = ['build', 'afterCreate', 'causedBy', 'toObject', 'buildStack', 'copyStack',
            'initSign', 'addSign', 'getSign', 'removeSign', 'hasSign',
            'initOmit', 'addOmit', 'getOmit', 'inheritOmit'] as Keys<ErrorDefinedProvider>;

        const rec = {proper: false} as ErrorDefinedProvider;
        fields.forEach(field => {
            rec[field] = this[field];
        });

        // define itself temporarily for error operations
        this.hook.defineProvider<ErrorDefinedProvider>(LY_ATTACHED_ERROR, CommonError, rec);

        // when new error provider is defined, replace all common methods
        this.hook.whenProviderDefined<ErrorDefinedProvider>(LY_ATTACHED_ERROR, CommonError, (ins) => {
            fields.forEach(field => {
                if (typeof ins[field] === 'function') {
                    this[field] = ins[field];
                }
            });
        });
    }

    get $secure(): CommonErrorSecure {
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
        this.hook.queueForCallback(LY_PENDING_ERROR_REGISTER, cls);
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