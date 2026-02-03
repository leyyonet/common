import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 406 Not Acceptable
 *
 * The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
 * */
export class NotAcceptableError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Not acceptable', 406, opt);
    }
}
