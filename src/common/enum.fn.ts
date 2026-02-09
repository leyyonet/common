// noinspection JSUnusedGlobalSymbols

import {EnumData, EnumInertEagerOpt, EnumInertItem, EnumInertLazyOpt, EnumItem} from "../index.types";
import {isFilledArr, isFilledObj, isText} from "../function";
import {LY_ENUM_ALT, LY_ENUM_NAME} from "../const";
import {FQN} from "../internal";
import {DeveloperError} from "../error";
import {testCase} from "./test.fn";
import {
    buildInert,
    defineInertEager,
    defineInertLazy,
    getInert,
    isInertDefined,
    isInertEager,
    isInertLazy,
    loadInertLazy
} from "./inert.fn";

// region properties
const where = `${FQN}.EnumFn`;
// endregion properties

// region inert
/**
 * Define an enum
 *
 * @param {EnumData} data - enum map or literal
 * @param {string} name - enum name
 * @param {EnumInertEagerOpt} options - enum options
 * */
export function defineEnum(data: EnumData, name: string, options: EnumInertEagerOpt): void {
    if ((isFilledArr(data) || isFilledObj(data)) && !data[LY_ENUM_NAME] && isText(name)) {
        data[LY_ENUM_NAME] = name;
    }
    defineInertEager<EnumInertItem, EnumData>('enum', data, options);
}

/**
 * Define an enum as lazy (with path)
 *
 * @param {EnumInertLazyOpt} options - enum options
 * */
export function defineLazyEnum(options: EnumInertLazyOpt): void {
    defineInertLazy<EnumInertItem, EnumData>('enum', options);
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
    return isInertLazy('enum', name);
}

/**
 * Check enum defined as eager, by name
 *
 * @param {string} name - enum name
 * @return {boolean}
 * */
export function isEnumEager(name: string): boolean {
    return isInertEager('enum', name);
}

/**
 * Check enum defined or not, by name
 *
 * @param {string} name - enum name
 * @return {boolean}
 * */
export function isEnumDefined(name: string): boolean {
    return isInertDefined('enum', name);
}

/**
 * Get enum by name
 * Note:
 * - Enum may be lazy mode, so it has lazy paths without class
 *
 * @param {string} name - enum name
 * @return {EnumItem}
 * */
export function getEnum(name: string): EnumInertItem {
    return getInert('enum', name);
}

/**
 * Load lazy enum by name
 * Note:
 * - Enum must be exported as `foretell`
 *
 * @param {string} name - name of enum
 * @return {Promise<EnumItem>}
 * */
export async function loadLazyEnum(name: string): Promise<EnumInertItem> {
    return loadInertLazy('enum', name);
}

buildInert<EnumInertItem, EnumData>({
    cluster: 'enum',
    validateLambda: data => isFilledObj(data) || isFilledArr(data),
    getNameLambda: data => data ? data[LY_ENUM_NAME] : undefined,
    setNameLambda: (data, name) => data[LY_ENUM_NAME] = name,
    stampLambda: item => {
        item.target[LY_ENUM_NAME] = item.name;
        if (item.alt) {
            item.target[LY_ENUM_ALT] = item.alt;
        }
    },
    nextLoadLambda: async (item) => {
        if (item.target && item.altTarget) {
            try {
                item.alt = await item.altTarget;
                delete item.altTarget;
                if (item.alt) {
                    item.target[LY_ENUM_ALT] = item.alt;
                }
            } catch (e) {
                new DeveloperError('Callback error during loading enum alternate data', testCase(FQN, 186), where).log(e);
            }
        }
        delete item.altTarget;
    },
});

// endregion inert
