import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 404 Not Found
 *
 * The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
 * */
export class NotFoundError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Not found', 404, opt);
    }
}
