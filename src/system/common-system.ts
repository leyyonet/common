import {CommonSystemLike, CommonSystemSecure} from "./index-types";
import {LeyyoLike} from "../leyyo";
import {SysClass, SysClassItems, SysFunction, SysFunctionItems} from "../literal";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class CommonSystem implements CommonSystemLike, CommonSystemSecure {

    constructor() {
    }

    get $back(): CommonSystemLike {
        return this;
    }

    $init(leyyo: LeyyoLike): void {
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