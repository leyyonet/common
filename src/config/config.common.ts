import {FQN} from "../internal";
import YAML from 'yaml'
import fs from 'fs'
import path from "node:path";

import type {ConfigBasic, ConfigCommonLike, ConfigCommonSecure} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {Dict} from "../shared";

export class ConfigCommon implements ConfigCommonLike, ConfigCommonSecure {
    private value: Dict;

    constructor(private lyy: LeyyoLike) {
    }

    get<R = Dict>(pck?: string): R {
        if (!this.value) {
            return undefined;
        }
        if (typeof pck === 'string') {
            if (!this.value[pck]) {
                return undefined;
            }
            return this.value[pck] as R;
        }
        return this.value as R;
    }

    private _read(folder: string, name: string): boolean {
        const fullPath = path.normalize(`${folder}/leyyo${name}.yaml`);
        if (fs.existsSync(fullPath)) {
            const file = fs.readFileSync(fullPath, 'utf8');
            if (typeof file === 'string') {
                const value = YAML.parse(file);
                if (this.lyy.is.bareObject(value)) {
                    this.value = value;
                    return true;
                }
            }
        }
        return false;
    }
    read(): void {
        let myEnv = {} as ConfigBasic;
        if (this.lyy.is.object(process.env)) {
            myEnv = process.env as unknown as ConfigBasic;
        }
        const name = typeof myEnv.LEYYO_CONFIG === 'string' ? `.${myEnv.LEYYO_CONFIG}` : '';
        const parts = path.normalize(myEnv.PWD).split('/');
        let count = 0;
        while (count < 3) {
            if (this._read(parts.join('/'), name)) {
                break;
            }
            parts.pop();
            count++;
        }
    }
    toJSON(): unknown {
        return this.value ?? {'_version': '0.0.0', warn: 'no-file'};
    }
    // region secure

    get $secure(): ConfigCommonSecure {
        return this;
    }

    get $back(): ConfigCommonLike {
        return this;
    }

    $init(): void {
        this.read();
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, ConfigCommon, 'class', FQN);
        });
    }

    $update(value: Dict): void {
        if (this.lyy.is.bareObject(value)) {
            this.value = value;
        }
    }

    // endregion secure
}
