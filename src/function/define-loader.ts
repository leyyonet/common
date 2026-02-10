import {isFilledArr, isText} from "./is.fn";
import {KEY_LOADER_NAME} from "../const";
import {LoaderItem, LoaderLike} from "./index.types";

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

