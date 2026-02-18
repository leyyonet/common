import {isFilledArr} from "./is-filled-arr.js";
import {isText} from "./is-text.js";
import {KEY_LOADER_NAME} from "../const/index.js";
import {LoaderItem, LoaderLike} from "./index.types.js";

/**
 * Set name of a loader
 *
 * @param {string} fqn - component name
 * @param {...LoaderItem[]} items - items
 * */
export function defineLoader(fqn: string, ...items: Array<LoaderItem>): LoaderLike {
    if ( !isText(fqn)) {
        fqn = `leyyo/@${Date.now()}`;
    }
    if ( !isFilledArr(items)) {
        items = [];
    }
    const loader: LoaderLike = [...items];
    loader[KEY_LOADER_NAME] = fqn;
    return loader;
}

