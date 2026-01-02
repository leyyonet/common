import type {FqnHookCommon, FqnCommonLike, FqnCommonSecure, FqnDefinedProvider, FqnStereoType} from "./index.types";
import {LeyyoHookCommon, type LeyyoLike} from "../leyyo";
import type {Fnc, Obj} from "../shared";
import {FQN} from "../internal";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class FqnCommon implements FqnCommonLike, FqnCommonSecure {

    private proper: boolean;
    private _pendingSign: symbol;

    constructor(private lyy: LeyyoLike) {
        this.name.bind(this);
        this.exists.bind(this);
        this.register.bind(this);
    }

    private get pendingSign(): symbol {
        if (this._pendingSign) {
            return this._pendingSign;
        }
        this._pendingSign = this.lyy.descriptor.sym(FQN, 'fqnPending');
        return this._pendingSign;
    }

    get $back(): FqnCommonLike {
        return this;
    }

    $init(): void {

        this.lyy.$secure
            .$lazyRun(() => {
            const rec = {
                proper: false,
                exists: this.exists,
                name: this.name,
                register: this.register,
            } as FqnDefinedProvider;

            // define itself temporarily for fqn operations
            this.lyy.hook.defineProvider<FqnDefinedProvider>(LeyyoHookCommon.fqnAttached, FqnCommon, rec);

            // when new fqn provider is defined, replace all common methods
            this.lyy.hook.whenProviderDefined<FqnDefinedProvider>(LeyyoHookCommon.fqnAttached, FqnCommon, (ins) => {
                if (ins.proper) {
                    this.proper = true;
                }
                this.exists = ins.exists;
                this.name = ins.name;
                this.register = ins.register;
            });
        })
            .$lazyRun(() => {
            this.lyy.fqn.register(null, FqnCommon, 'class', FQN);
        });
    }

    get $secure(): FqnCommonSecure {
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
        this.lyy.hook.queueForCallback(LeyyoHookCommon.fqnPendingRegister, name, value, type, pckName);
    }

    get isProper(): boolean {
        return this.proper;
    }
    $appendHook(target: Function | Object, callback: FqnHookCommon): void {
        let callbacks = this.lyy.descriptor.getValue<Array<FqnHookCommon>>(target, this.pendingSign);
        if (!Array.isArray(callbacks)) {
            callbacks = [];
        }
        callbacks.push(callback);
        this.lyy.descriptor.save(target, this.pendingSign, callbacks);
    }
    $runHooks(fn: Fnc | Obj, name: string): void {
        const callbacks: Array<FqnHookCommon> = [];
        let exists = false;
        const desc = this.lyy.descriptor.get<Array<FqnHookCommon>>(fn, this.pendingSign);
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
                    this.lyy.dev.log(e, {issue: 'lambda.run', where: `${FQN}.CommonFqn`, method: '$runHooks', name, clazz: this.name(fn)});
                }
            });
            this.lyy.descriptor.remove(fn, this.pendingSign);
        }
    }

    addHook(target: Function | Object, callback: FqnHookCommon): boolean {
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
