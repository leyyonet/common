// noinspection JSUnusedGlobalSymbols

import {EnumData, EnumDefineEagerOpt, EnumDefineLazyOpt, EnumItem, EnumType} from "../index.types";
import {isFilledArr, isFilledObj, isText} from "../function";
import {LY_ENUM_ALT, LY_ENUM_NAME} from "../const";
import {FQN} from "../internal";
import {newRepoMap} from "./map.fn";
import {newRepoSet} from "./set.fn";
import {DeveloperError} from "../error";

// region properties
const where = `${FQN}.EnumFn`;
const items = newRepoSet<EnumData>(`${where}.items`);
const names = newRepoMap<string, EnumItem>(`${where}.names`);
// endregion properties

/**
 * Define an enumeration as eager (with data)
 *
 * Options:
 * - classic enumeration as `enum name {...}`
 * - literal enumeration as `[...]`
 *
 * @param {(EnumData)} data - map or literal readonly array
 * @param {EnumDefineEagerOpt} opt - enum options
 * */
export function defineEnum(data: EnumData, opt: EnumDefineEagerOpt): void {
    if (!(isFilledObj(data) || isFilledArr(data))) {
        throw new DeveloperError('Invalid enum data', 'onDeployed#01', where);
    }
    if (!isFilledObj(opt)) {
        throw new DeveloperError('Invalid enum options', 'onDeployed#01', where);
    }
    if (!isText(opt.name)) {
        throw new DeveloperError('Invalid enum name', 'onDeployed#01', where);
    }
    if (isAlreadyDefined(opt.name, data)) {
        return;
    }

    const type: EnumType = Array.isArray(data) ? 'literal' : 'map';
    items.add(data);
    names.set(opt.name, {...opt, mode: 'eager', type, data});

    data[LY_ENUM_NAME] = opt.name;
    if (isFilledObj(opt.alt)) {
        data[LY_ENUM_ALT] = opt.alt;
    }
}

/**
 * Check conflict case
 *
 * @param {string} name - enum name
 * @param {EnumData} data - enum object or literals
 * @return {boolean} - if yes: it was already defined
 * */
function isAlreadyDefined(name: string, data: EnumData): boolean {
    return data[LY_ENUM_NAME] && items.has(data) && names.has(name);
}

/**
 * Define an enumeration as lazy (with path)
 *
 * Options:
 * - classic enumeration as `enum name {...}`
 * - literal enumeration as `[...]`
 *
 * @param {EnumDefineLazyOpt} opt - enum options
 * */
export function defineLazyEnum(opt: EnumDefineLazyOpt): void {
    if (!isFilledObj(opt)) {
        throw new DeveloperError('Invalid enum options', 'onDeployed#01', where);
    }
    if (!(opt.lazyData instanceof Promise)) {
        throw new DeveloperError('Invalid enum load path', 'onDeployed#01', where);
    }
    names.set(opt.name, {...opt, mode: 'lazy'});
}

/**
 * Check enum defined as lazy, by name
 * Note:
 * - Enum's mode will be shifted lazy to eager after loaded
 *
 * @param {string} name - enum name
 * @return {boolean}
 * */
export function isEnumLazy(name: string): boolean {
    return getEnum(name)?.mode === 'lazy';
}

/**
 * Check enum defined as eager, by name
 *
 * @param {string} name - enum name
 * @return {boolean}
 * */
export function isEnumEager(name: string): boolean {
    return getEnum(name)?.mode === 'eager';
}

/**
 * Check enum defined or not, by name
 *
 * @param {string} name - enum name
 * @return {boolean}
 * */
export function isEnumDefined(name: string): boolean {
    return !!getEnum(name);
}

/**
 * Get enum by name
 * Note:
 * - Enum may be lazy mode, so it has lazy paths without data
 *
 * @param {string} name - enum name
 * @return {EnumItem}
 * */
export function getEnum(name: string): EnumItem {
    if (!isText(name)) {
        return undefined;
    }
    if (!names.has(name)) {
        return undefined;
    }
    return names.get(name);
}

/**
 * Load lazy enum by name
 * Note:
 * - Enum must be exported as `foretell`
 *
 * @param {string} name - name of enum
 * @return {Promise<EnumItem>}
 * */
export async function getLazyEnum(name: string): Promise<EnumItem> {
    if (!isText(name)) {
        return undefined;
    }
    if (!names.has(name)) {
        return undefined;
    }
    const item = names.get(name);
    if (item.mode === 'eager') {
        return item;
    }
    try {
        item.data = await item.lazyData;
        if (item.data) {
            if (isAlreadyDefined(name, item.data)) {
                delete item.lazyData;
                delete item.lazyAlt;
                return item;
            }
            item.data[LY_ENUM_NAME] = name;
            item.mode = 'eager';
            item.type = Array.isArray(item.data) ? 'literal' : 'map';
        }
    } catch (e) {
        new DeveloperError('Raised callback run', 'optCheck#01', where).log(e);
    }
    if (item.data && item.lazyAlt) {
        try {
            item.alt = await item.lazyAlt;
            delete item.lazyAlt;
            if (item.alt) {
                item.data[LY_ENUM_ALT] = item.alt;
            }
        }
        catch (e) {
            new DeveloperError('Raised callback run', 'optCheck#01', where).log(e);
        }
    }
    delete item.lazyData;
    delete item.lazyAlt;
    return item;
}
