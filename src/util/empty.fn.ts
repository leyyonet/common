import type {Arr} from "../shared";

/**
 * Empty function, it can be more useful sometimes
 *
 * @param {Arr} args - insignificant parameters
 * @return {any}
 * */
export function emptyFn<R = unknown>(...args: Arr): R|void {}
