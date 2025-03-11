import {CommonFqn, CommonFqnSecure} from "./index-types";
import {Leyyo} from "../leyyo";
import {
    CommonFqnHook,
    FqnDefinedProvider,
    FqnStereoType,
    LY_ATTACHED_FQN,
    LY_PENDING_FQN_REGISTER,
    LY_SIGN_FQN_HOOK
} from "../shared";
import {CommonHook} from "../hook";
import {SysClass, SysClassItems, SysFunction, SysFunctionItems} from "../literal";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class CommonFqnImpl implements CommonFqn, CommonFqnSecure {
    private hook: CommonHook;
    private proper: boolean;

    constructor() {
        this.name.bind(this);
        this.exists.bind(this);
        this.register.bind(this);
    }
    get $back(): CommonFqn {
        return this;
    }

    $init(leyyo: Leyyo): void {
        this.hook = leyyo.hook;

        const rec = {
            proper: false,
            exists: this.exists,
            name: this.name,
            register: this.register,
        } as FqnDefinedProvider;

        // define itself temporarily for fqn operations
        leyyo.hook.defineProvider<FqnDefinedProvider>(LY_ATTACHED_FQN, CommonFqnImpl, rec);

        // when new fqn provider is defined, replace all common methods
        leyyo.hook.whenProviderDefined<FqnDefinedProvider>(LY_ATTACHED_FQN, CommonFqnImpl, (ins) => {
            if (ins.proper) {
                this.proper = true;
            }
            this.exists = ins.exists;
            this.name = ins.name;
            this.register = ins.register;
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
        this.hook.queueForCallback(LY_PENDING_FQN_REGISTER, name, value, type, pckName);
    }
    get isProper(): boolean {
        return this.proper;
    }
    addHook(target: Function|Object, callback: CommonFqnHook): boolean {
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
        let callbacks: Array<CommonFqnHook>;
        try {
            callbacks = Object.getOwnPropertyDescriptor(target, LY_SIGN_FQN_HOOK) as Array<CommonFqnHook> ?? [];
        } catch (e) {
            console.log(`CommonFqnImpl.hook.get`, e.message);
        }
        if (!Array.isArray(callbacks)) {
            callbacks = [];
        }
        callbacks.push(callback);
        try {
            Object.defineProperty(target, LY_SIGN_FQN_HOOK, {
                value: callbacks,
                configurable: false,
                writable: false,
                enumerable: false
            });
        } catch (e) {
            console.log(`CommonFqnImpl.hook.set`, e.message);
            return false;
        }
        return true;
    }
    isSysFunction(method: string): boolean {
        if (typeof method !== 'string') {
            return false;
        }
        return SysFunctionItems.includes(method as SysFunction);
    }
    isSysClass(clazz: string|Function): boolean {
        let name: string;
        if (typeof clazz === 'function') {
            name = clazz.name;
        }
        else if (typeof clazz === 'string') {
            name = clazz;
        }
        if (!name) {
            return false;
        }
        return SysClassItems.includes(name as SysClass);
    }


}