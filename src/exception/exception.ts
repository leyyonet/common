import type {ErrorCommonLike} from "../error";
import type {Abstract, ClassLike, ClassOrName, Dict} from "../shared";
import type {LogLine} from "../log";
import type {LeyyoLike} from "../leyyo";
import type {ExceptionLike, ExceptionParamsAppend, ExceptionSecure, ExceptionStackLine} from "./index.types";
import type {DevOpt} from "../developer";


export class Exception extends Error implements ExceptionLike, ExceptionSecure {
    private static lyy: LeyyoLike;

    protected _params: Dict;
    protected _parsed: Array<ExceptionStackLine>;
    protected _holder?: ClassOrName;
    protected _cause?: ExceptionLike;
    protected _req?: unknown;

    constructor(message: string, params?: Dict) {
        if (global?.leyyo_is_testing || Exception.lyy.test.is) {
            if (Exception.lyy.dev) {
                message += ` => ${Exception.lyy.dev.secureJson(params, true)}`;
            }
        }
        super(message);
        this.name = Exception.lyy.fqn.name(this);
        this._params = params ?? {};
        this._parsed = [];
        Exception.lyy.error.afterCreate(this);
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
        this._cause = Exception.lyy.error.causedBy(e);
        return this;
    }

    with(value: ClassLike | Abstract<any> | string | any): this {
        this._holder = Exception.lyy.fqn.name(value);
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
        const params = {} as DevOpt;
        if (this._req) {
            params['req'] = this._req;
        }
        params.where = this._holder;
        // todo collect properties
        const line = {level: 'error', message: this, params} as LogLine;
        this.$addSign('printed');
        Exception.lyy.log.apply(line);
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
        return Exception.lyy.error.toObject(this, ...omittedFields);
    }

    toJSON() {
        try {
            return this.toObject();
        } catch (e) {
            return {name: this.name, message: this.message, params: this._params};
        }
    }

    static cast(e: string | Error): ExceptionLike {
        return Exception.lyy.error.build(e);
    }

    $hasSign(key: string): boolean {
        return Exception.lyy.error.hasSign(this, key);
    }

    $listSigns(): Array<string> {
        return Exception.lyy.error.getSign(this);
    }

    $addSign(...keys: Array<string>): boolean {
        return Exception.lyy.error.addSign(this, ...keys);
    }

    $removeSign(...keys: Array<string>): boolean {
        return Exception.lyy.error.removeSign(this, ...keys);
    }

    static $setLeyyo(lyy: LeyyoLike) {
        this.lyy = lyy;
    }

    static get $error(): ErrorCommonLike {
        return this.lyy.error;
    }

    get $back(): ExceptionLike {
        return this;
    }

    get $secure(): ExceptionSecure {
        return this;
    }

}

export type ExceptionClass<E extends Exception = Exception> = ClassLike<E>;
