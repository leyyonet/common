import {CommonError} from "../error";
import {Abstract, ClassLike, ClassOrName, Dict, LogLine} from "../shared";
import {CommonLog} from "../log";
import {Leyyo} from "../leyyo";
import {CommonAssertion} from "../assertion";
import {ExceptionLike, ExceptionParamsAppend, ExceptionSecure, ExceptionStackLine} from "./index-types";
import {CommonFqn} from "../fqn";


export class Exception extends Error implements ExceptionLike, ExceptionSecure {
    private static _fqn: CommonFqn;
    private static _error: CommonError;
    private static _log: CommonLog;
    private static _assertion: CommonAssertion;

    protected _params: Dict;
    protected _parsed: Array<ExceptionStackLine>;
    protected _holder?: ClassOrName;
    protected _cause?: ExceptionLike;
    protected _req?: unknown;

    constructor(message: string, params?: Dict) {
        if (global?.leyyo_is_testing) {
            message += ` => ${JSON.stringify(Exception._assertion.secureJson(params))}`;
        }
        super(message);
        this.name = Exception._fqn.name(this);
        this._params = params ?? {};
        this._parsed = [];
        Exception._error.afterCreate(this);
    }

    get params(): Dict {
        return this._params;
    }

    $setName(name: string): this {
        if (typeof name === 'string') {
            this.name = name;
        }
        return this;
    }

    // noinspection JSUnusedLocalSymbols
    causedBy(e: Error | string): this {
        this._cause = Exception._error.causedBy(e);
        return this;
    }

    with(value: ClassLike | Abstract<any> | string | any): this {
        this._holder = Exception._fqn.name(value);
        return this;
    }

    appendParams(params: ExceptionParamsAppend, ignoreExisting?: boolean): this {
        this._params = this._params ?? {};
        try {
            for (const [k, v] of Object.entries(params)) {
                if (!(ignoreExisting && this._params[k] !== undefined)) {
                    this._params[k] = v;
                }
            }
        } catch (e) {
        }
        return this;
    }

    log(req?: unknown): this {
        if (this.$hasSign('printed')) {
            return this;
        }
        if (req) {
            this._req = req;
        }
        const params = {};
        if (this._req) {
            params['req'] = this._req;
        }
        // todo collect properties
        const line = {severity: 'error', message: this, params, holder: this._holder} as LogLine;
        this.$addSign('printed');
        Exception._log.apply(line);
        return this;
    }

    raise(throwable = true, req?: unknown): this {
        if (!throwable) {
            if (req) {
                this._req = req;
            }
            this.log();
            return undefined;
        }
        throw this;
    }


    toObject(...omittedFields: Array<string>): Dict {
        return Exception._error.toObject(this, ...omittedFields);
    }

    toJSON() {
        try {
            return this.toObject();
        } catch (e) {
            return {name: this.name, message: this.message, params: this._params};
        }
    }

    static cast(e: string | Error): ExceptionLike {
        return Exception._error.build(e);
    }

    $hasSign(key: string): boolean {
        return Exception._error.hasSign(this, key);
    }

    $listSigns(): Array<string> {
        return Exception._error.getSign(this);
    }

    $addSign(...keys: Array<string>): boolean {
        return Exception._error.addSign(this, ...keys);
    }

    $removeSign(...keys: Array<string>): boolean {
        return Exception._error.removeSign(this, ...keys);
    }

    static $setLeyyo(leyyo: Leyyo) {
        if (!this._fqn) {
            this._fqn = leyyo.fqn;
        }
        if (!this._error) {
            this._error = leyyo.error;
        }
        if (!this._log) {
            this._log = leyyo.log;
        }
        if (!this._assertion) {
            this._assertion = leyyo.assertion;
        }
    }

    static get $error(): CommonError {
        return this._error;
    }

    get $back(): ExceptionLike {
        return this;
    }

    get $secure(): ExceptionSecure {
        return this;
    }

}
