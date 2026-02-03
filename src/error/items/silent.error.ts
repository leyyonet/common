import type {Opt} from "../../opt";
import {LeyyoError} from "./leyyo.error";
import {Leyyo} from "../../leyyo/leyyo";

/**
 * Silent error
 *
 * It does not trigger any event after it raised
 * */
export class SilentError extends LeyyoError {
    protected _silent = true;
    constructor(e: Error, opt?: Opt) {
        super(e.message ?? 'Silent error', opt);
        this.$setName(e.name ?? 'SilentError');
    }
}
