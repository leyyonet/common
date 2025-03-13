import {CommonFqnLike, CommonFqnSecure} from "./index-types";
import {LeyyoLike} from "../leyyo";
import {
    CommonFqnHook,
    FqnDefinedProvider,
    FqnSignHook,
    FqnStereoType,
    LY_ATTACHED_FQN,
    LY_PENDING_FQN_REGISTER
} from "../shared";
import {CommonHookLike} from "../hook";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class CommonFqn implements CommonFqnLike, CommonFqnSecure {
    private hook: CommonHookLike;
    private proper: boolean;

    constructor() {
        this.name.bind(this);
        this.exists.bind(this);
        this.register.bind(this);
    }

    get $back(): CommonFqnLike {
        return this;
    }

    $init(leyyo: LeyyoLike): void {
        this.hook = leyyo.hook;

        const rec = {
            proper: false,
            exists: this.exists,
            name: this.name,
            register: this.register,
        } as FqnDefinedProvider;

        // define itself temporarily for fqn operations
        leyyo.hook.defineProvider<FqnDefinedProvider>(LY_ATTACHED_FQN, CommonFqn, rec);

        // when new fqn provider is defined, replace all common methods
        leyyo.hook.whenProviderDefined<FqnDefinedProvider>(LY_ATTACHED_FQN, CommonFqn, (ins) => {
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
        let callbacks: Array<CommonFqnHook>;
        try {
            callbacks = Object.getOwnPropertyDescriptor(target, FqnSignHook) as Array<CommonFqnHook> ?? [];
        } catch (e) {
            console.log(`CommonFqnImpl.hook.get`, e.message);
        }
        if (!Array.isArray(callbacks)) {
            callbacks = [];
        }
        callbacks.push(callback);
        try {
            Object.defineProperty(target, FqnSignHook, {
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
}