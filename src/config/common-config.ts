import {CommonConfigLike, CommonConfigSecure, ConfigBasic} from "./index.types";
import {LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import {Dict} from "../shared";
import YAML from 'yaml'
import fs from 'fs'
import path from "node:path";

export class CommonConfig implements CommonConfigLike, CommonConfigSecure {
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

    read(): void {
        let myEnv = {} as ConfigBasic;
        if (this.lyy.is.object(process.env)) {
            myEnv = process.env as unknown as ConfigBasic;
        }
        const name = typeof myEnv.LEYYO_CONFIG === 'string' ? `.${myEnv.LEYYO_CONFIG}` : '';
        const fullPath = path.normalize(`${myEnv.PWD}/leyyo${name}.yml`);
        if (fs.existsSync(fullPath)) {
            const file = fs.readFileSync('./file.yml', 'utf8');
            if (typeof file === 'string') {
                const value = YAML.parse(file);
                if (this.lyy.is.bareObject(value)) {
                    this.value = value;
                }
                else {
                    console.warn(`Config is not an object: ${fullPath}`);
                }
            }
            else {
                console.warn(`Config content is not valid: ${fullPath}`);
            }
        }
        else {
            console.warn(`Config could not be found: ${fullPath}`);
        }
    }

    // region secure

    get $secure(): CommonConfigSecure {
        return this;
    }

    get $back(): CommonConfigLike {
        return this;
    }

    $init(): void {
        this.read();
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonConfig, 'class', FQN);
        });
    }

    $update(value: Dict): void {
        if (this.lyy.is.bareObject(value)) {
            this.value = value;
        }
    }

    // endregion secure
}
