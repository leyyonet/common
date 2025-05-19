import {ClassLike, Func, Obj} from "../shared";
import {FQN_PCK} from "../internal";
import {LeyyoLike} from "../leyyo";
import {CommonDescriptorLike, CommonDescriptorSecure, PropDescriptor} from "./index-types";

export class CommonDescriptor implements CommonDescriptorLike, CommonDescriptorSecure {
    private lyy: LeyyoLike;

    private _funcSign: symbol;

    private get funcSign(): symbol {
        if (this._funcSign) {
            return this._funcSign;
        }
        this._funcSign = this.sym(FQN_PCK, 'funcSign');
        return this._funcSign;
    }
    sign(fn: Func | ClassLike): void {
        this.lyy.assertion.func(fn, () => this.lyy.dev.opt({field: 'fn', type: typeof fn, where: `${FQN_PCK}.CommonDescriptor`, method: 'sign'}));
        this.save(fn, this.funcSign, true);
    }

    isSigned(fn: Func | ClassLike): boolean {
        if (typeof fn !== 'function') {
            return false;
        }
        return this.has(fn, this.funcSign);
    }
    sym(...values: Array<string>): symbol {
        return Symbol.for(values.join('/'));
    }
    symName(sym: symbol): string {
        if (typeof sym !== 'symbol') {
            return '';
        }
        const parts = sym.description.split('/');
        return parts.length >= 2 ? parts[1] : '';
    }
    get<T = any>(target: Func | Obj, key: string | symbol, notSystem?: boolean): PropDescriptor<T> {
        if (!target) {
            return undefined;
        }
        if (notSystem && this.$isNot(target, key)) {
            return undefined;
        }
        try {
            return Object.getOwnPropertyDescriptor(target, key) as PropDescriptor<T> ?? null;
        } catch (e) {
            this.lyy.dev.log(e, {issue: 'get.descriptor', key, where: `${FQN_PCK}.CommonDescriptor`}, 'debug');
        }
        return undefined;
    }

    getValue<T = any>(target: Func | Obj, key: string | symbol): T {
        const result = this.get(target, key);
        return result ? result.value : undefined;
    }

    has(target: Func | Obj, key: string | symbol): boolean {
        const result = this.get(target, key);
        return !!result;
    }

    $isNot<T = any>(target: Func | Obj, key: string | symbol): boolean {
        return (!['string', 'symbol'].includes(typeof key)) ||
            (key === ((typeof target === 'object') ? 'constructor' : 'prototype'));
    }
    remove(target: Func | Obj, key: string | symbol, notSystem?: boolean): boolean {
        if (!target) {
            return false;
        }
        if (notSystem && this.$isNot(target, key)) {
            return false;
        }
        try {
            if (Object.getOwnPropertyDescriptor(target, key)) {
                delete target[key];
                return true;
            }
        } catch (e) {
            this.lyy.dev.log(e, {issue: 'remove.descriptor', key, where: `${FQN_PCK}.CommonDescriptor`}, 'debug');
        }
        return false;
    }

    save<T = any>(target: Func | Obj, key: string | symbol, value: T, notSystem?: boolean): boolean {
        if (!target) {
            return false;
        }
        if (notSystem && this.$isNot(target, key)) {
            return false;
        }
        try {
            Object.defineProperty(target, key, {
                value,
                configurable: true,
                writable: false,
                enumerable: false
            });
        } catch (e) {
            this.lyy.dev.log(e, {issue: 'save.descriptor', key, where: `${FQN_PCK}.CommonDescriptor`}, 'debug');
            return false;
        }
        return true;
    }

    // region secure
    get $back(): CommonDescriptorLike {
        return this;
    }

    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonDescriptor, 'class', FQN_PCK);
        });
    }

    get $secure(): CommonDescriptorSecure {
        return this;
    }
    // endregion secure

}
