import type {SystemCommonLike, SystemCommonSecure} from "./index.types";
import {LeyyoHookCommon, type LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import {EnvironmentItems} from "./environment";
import {CountryCodeItems} from "./country-code";
import {LanguageCodeItems} from "./language-code";
import {LocaleCodeItems} from "./locale-code";
import {type SysClass, SysClassItems} from "./sys-class";
import {type SysFunction, SysFunctionItems} from "./sys-function";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class SystemCommon implements SystemCommonLike, SystemCommonSecure {

    constructor(private lyy: LeyyoLike) {
    }

    get $back(): SystemCommonLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure
            .$lazyRun(() => {
                this.lyy.fqn.register(null, SystemCommon, 'class', FQN);
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
                this.lyy.hook.queueForCallback(LeyyoHookCommon.enumPendingRegister, value);
            }
        });
    }

    get $secure(): SystemCommonSecure {
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
