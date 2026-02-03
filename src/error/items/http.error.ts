import {LeyyoError} from "./leyyo.error";
import type {HttpStatus} from "../../shared";
import type {Opt} from "../../opt";

/**
 * Http abstract error
 * */
export abstract class HttpError extends LeyyoError {

    // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
    /**
     * @param {string} message - error message
     * @param {number} status - http status
     * @param {Opt} opt - options
     * */
    constructor(message: string, public status: HttpStatus, opt?: Opt) {
        super(message, opt);
    }
}
