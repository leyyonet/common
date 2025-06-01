import {CommonSystemLike, CommonSystemSecure} from "./index.types";
import {LeyyoCommonHook, LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import {EnvironmentItems} from "./environment";
import {CountryCodeItems} from "./country-code";
import {LanguageCodeItems} from "./language-code";
import {LocaleCodeItems} from "./locale-code";
import {SysClass, SysClassItems} from "./sys-class";
import {SysFunction, SysFunctionItems} from "./sys-function";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class CommonSystem implements CommonSystemLike, CommonSystemSecure {
    private lyy: LeyyoLike;

    constructor() {
    }

    get $back(): CommonSystemLike {
        return this;
    }

    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;
        this.lyy.$secure
            .$lazyRun(() => {
                this.lyy.fqn.register(null, CommonSystem, 'class', FQN);
        })
            .$lazyRun(() => {
            const enumMap = {
                Environment: EnvironmentItems,
                CountryCode: CountryCodeItems,
                LanguageCode: LanguageCodeItems,
                LocaleCode: LocaleCodeItems,
                SysClass: SysClassItems,
                SysFunction: SysFunctionItems,
            };
            for (const [name, value] of Object.entries(enumMap)) {
                this.lyy.fqn.register(name, value, 'enum', FQN);
                this.lyy.hook.queueForCallback(LeyyoCommonHook.enumPendingRegister, value);
            }
        });
    }

    get $secure(): CommonSystemSecure {
        return this;
    }

    isSysFunction(method: string): boolean {
        if (typeof method !== 'string') {
            return false;
        }
        return SysFunctionItems.includes(method as SysFunction);
    }

    isSysClass(clazz: string | Function): boolean {
        let name: string;
        if (typeof clazz === 'function') {
            name = clazz.name;
        } else if (typeof clazz === 'string') {
            name = clazz;
        }
        if (!name) {
            return false;
        }
        return SysClassItems.includes(name as SysClass);
    }

}
