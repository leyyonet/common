import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 405 Method Not Allowed
 *
 * A request method is not supported for the requested resource (for example, a GET request on a form that requires data to be presented
 * */
export class MethodNotAllowedError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Method not allowed', 405, opt);
    }
}
