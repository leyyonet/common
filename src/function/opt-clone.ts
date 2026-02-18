// noinspection JSUnusedGlobalSymbols
import {isObj} from "./is-obj.js";
import {secureClone} from "./secure-clone.js";
import {Opt} from "./index.types.js";

/**
 * Clone existing option
 *
 * @param {Opt} options - source options
 * @return {Opt} - cloned options
 * */
export function optClone<O extends Opt = Opt>(options: O | Opt): O {
    return (isObj(options) ? secureClone(options) : {}) as O;
}
