import {CommonError, CommonErrorCb, CommonErrorSecure, ExceptionLike} from "./index-types";
import {Leyyo} from "../leyyo";
import {Dict, Keys} from "../aliases";
import {Exception} from "./exception";
import {CommonLogCb} from "../log";
import {LY_ATTACHED_ERROR} from "../constants";

// noinspection JSUnusedLocalSymbols
export class CommonErrorImpl implements CommonError, CommonErrorSecure {

    get $back(): CommonError {
        return this;
    }

    $init(leyyo: Leyyo): void {


        const fields = ['build', 'afterCreate', 'causedBy', 'toObject', 'buildStack', 'copyStack',
            'initSign', 'addSign', 'getSign', 'removeSign', 'hasSign',
            'initOmit', 'addOmit', 'getOmit', 'inheritOmit'] as Keys<CommonErrorCb>;

        const rec = {proper: false} as CommonErrorCb;
        fields.forEach(field => {
            rec[field] = this[field];
        });

        // define itself temporarily for error operations
        leyyo.callback.defineProvider<CommonErrorCb>(LY_ATTACHED_ERROR, CommonErrorImpl, rec);

        // when new error provider is defined, replace all common methods
        leyyo.callback.whenProviderDefined<CommonLogCb>(LY_ATTACHED_ERROR, CommonErrorImpl, (ins) => {
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

    build(e: Error | string): ExceptionLike {
        if (e instanceof Exception) {
            return e;
        }
        else if (e instanceof Error) {
            const err = new Exception(e.message, this.toObject(e, 'message', 'stack'));
            this.copyStack(err, e);
            return err;
        }
        else if (typeof e === 'string') {
            return new Exception(e);
        }
        return new Exception(`Unknown error`, {...this.toObject(e), type: typeof e});
    }

    buildStack(e: Error): void {
    }
    copyStack(exception: Exception, error: Error): void {
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