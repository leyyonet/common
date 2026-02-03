import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 410 Gone
 *
 * Indicates that the resource requested was previously in use but is no longer available and will not be available again
 * */
export class GoneError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Gone', 410, opt);
    }
}
