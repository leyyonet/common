import type {Opt} from "../../opt";
import {LeyyoError} from "./leyyo.error";

/**
 * Caused error
 * */
export class CausedError extends LeyyoError {
    constructor(message: string, opt?: Opt, causedError?: Error) {
        super(message ?? causedError.message ?? 'Caused error', opt);
        this.causedBy = causedError;
    }
}
