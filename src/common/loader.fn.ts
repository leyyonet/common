import {LY_LOADER_EMPTY, LY_LOADER_NAME, LY_LOADER_STAMP} from "../const";
import {LeyyoStampEmpty, LeyyoStampLambda, LoaderItem, LoaderLike} from "../index.types";
import {isFilledArr, isText} from "../function";

/**
 * Set name of a loader
 *
 * @param {string} fqn - component name
 * @param {...LoaderItem[]} items - items
 * */
export function defineLoader(fqn: string, ...items: Array<LoaderItem>): LoaderLike {
    if (!isText(fqn)) {
        fqn = `leyyo/@${Date.now()}`;
    }
    if (!isFilledArr(items)) {
        items = [];
    }
    const loader: LoaderLike = [...items];
    loader[LY_LOADER_NAME] = fqn;
    return loader;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Stamp an instance for loader
 *
 * @param {function} fn - callback function to save
 * @return {(LeyyoStampLambda | LeyyoStampEmpty)} - stamped function
 * */
export function stampLoader(fn: LeyyoStampLambda): LeyyoStampLambda | LeyyoStampEmpty {
    if (typeof fn === 'function') {
        fn[LY_LOADER_STAMP] = true;
        return fn;
    }
    return (() => LY_LOADER_EMPTY) as LeyyoStampEmpty;
}
