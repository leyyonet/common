import {FQN} from "../internal";

import type {EnvCommonLike, EnvCommonSecure, EnvInstanceLike} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import {EnvInstance} from "./env.instance";

const WHERE = `${FQN}.EnvCommon`;
export class EnvCommon implements EnvCommonLike, EnvCommonSecure {
    private _instances: Map<string, EnvInstanceLike>; // pck x instance
    private _keys: Map<string, string[]>; // key x packages


    constructor(private lyy: LeyyoLike) {

    }

    build<K extends string = string>(pck: string): EnvInstance<K> {
        if (!this._instances) {
            this._instances = this.lyy.repo.newMap<string, EnvInstanceLike>(`${WHERE}.instances`);
        }
        this.lyy.assertion.text(pck, () => {
            return {field: 'package', where: WHERE}
        });
        if (this._instances.has(pck)) {
            throw this.lyy.dev.developerError2(FQN, 701, {message: 'Package name is duplicated', value: pck, where: WHERE});
        }
        const ins = new EnvInstance<K>(pck);
        this._instances.set(pck, ins);
        return ins;
    }

    $addKey(key: string, pck: string): void {
        if (!this._keys) {
            this._keys = this.lyy.repo.newMap<string, string[]>(`${WHERE}.keys`);
        }
        if (!this._keys.has(key)) {
            this._keys.set(key, [pck]);
        }
        else {
            const packages = this._keys.get(key);
            if (!packages.includes(pck)) {
                packages.push(pck);
            }
        }
    }

    get $secure(): EnvCommonSecure {
        return this;
    }

    get $back(): EnvCommonLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, EnvCommon, 'class', FQN);
        });
    }
}
