import {VAL_NAME_ANONYMOUS} from "../const/index.js";

export function isAnonymousName(name: string): boolean {
    if (typeof name === 'string') {
        return name.trim().startsWith(VAL_NAME_ANONYMOUS);
    }
    return false;
}
