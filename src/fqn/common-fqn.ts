import {CommonFqnHook, CommonFqnLike, CommonFqnSecure, FqnDefinedProvider, FqnStereoType} from "./index-types";
import {LeyyoCommonHook, LeyyoLike} from "../leyyo";
import {Func, Obj} from "../shared";
import {FQN_PCK} from "../internal";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class CommonFqn implements CommonFqnLike, CommonFqnSecure {
    private lyy: LeyyoLike;
    private proper: boolean;
    private _pendingSign: symbol;

    constructor() {
        this.name.bind(this);
        this.exists.bind(this);
        this.register.bind(this);
    }

    private get pendingSign(): symbol {
        if (this._pendingSign) {
            return this._pendingSign;
        }
        this._pendingSign = this.lyy.descriptor.sym(FQN_PCK, 'fqnPending');
        return this._pendingSign;
    }

    get $back(): CommonFqnLike {
        return this;
    }

    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;

        this.lyy.$secure
            .$lazyRun(() => {
            const rec = {
                proper: false,
                exists: this.exists,
                name: this.name,
                register: this.register,
            } as FqnDefinedProvider;

            // define itself temporarily for fqn operations
            this.lyy.hook.defineProvider<FqnDefinedProvider>(LeyyoCommonHook.fqnAttached, CommonFqn, rec);

            // when new fqn provider is defined, replace all common methods
            this.lyy.hook.whenProviderDefined<FqnDefinedProvider>(LeyyoCommonHook.fqnAttached, CommonFqn, (ins) => {
                if (ins.proper) {
                    this.proper = true;
                }
                this.exists = ins.exists;
                this.name = ins.name;
                this.register = ins.register;
            });
        })
            .$lazyRun(() => {
            this.lyy.fqn.register(null, CommonFqn, 'class', FQN_PCK);
        });
    }

    get $secure(): CommonFqnSecure {
        return this;
    }

    name(value: any): string {
        switch (typeof value) {
            case "function":
                return value.name;
            case "object":
                return value.constructor.name;
            case "string":
                return value;
            default:
                return null;
        }
    }

    exists(target: any): boolean {
        return false;
    }

    register(name: string, value: any, type: FqnStereoType, pckName: string): void {
        this.lyy.hook.queueForCallback(LeyyoCommonHook.fqnPendingRegister, name, value, type, pckName);
    }

    get isProper(): boolean {
        return this.proper;
    }
    $appendHook(target: Function | Object, callback: CommonFqnHook): void {
        let callbacks = this.lyy.descriptor.getValue<Array<CommonFqnHook>>(target, this.pendingSign);
        if (!Array.isArray(callbacks)) {
            callbacks = [];
        }
        callbacks.push(callback);
        this.lyy.descriptor.save(target, this.pendingSign, callbacks);
    }
    $runHooks(fn: Func | Obj, name: string): void {
        const callbacks: Array<CommonFqnHook> = [];
        let exists = false;
        const desc = this.lyy.descriptor.get<Array<CommonFqnHook>>(fn, this.pendingSign);
        if (desc) {
            exists = true;
            if (Array.isArray(desc.value)) {
                callbacks.push(...desc.value);
            }
        }
        if (exists) {
            callbacks.forEach(lambda => {
                try {
                    lambda(name);
                } catch (e) {
                    this.lyy.dev.log(e, {issue: 'lambda.run', where: `${FQN_PCK}.CommonFqn`, method: '$runHooks', name, clazz: this.name(fn)});
                }
            });
            this.lyy.descriptor.remove(fn, this.pendingSign);
        }
    }

    addHook(target: Function | Object, callback: CommonFqnHook): boolean {
        if (typeof target === 'object') {
            try {
                target = target.constructor;
            } catch (e) {
            }
        }
        if (typeof target !== 'function' || typeof callback !== 'function') {
            return false;
        }
        if (this.proper) {
            callback(this.name(target));
            return true;
        }
        this.$appendHook(target, callback);
        return true;
    }
}
