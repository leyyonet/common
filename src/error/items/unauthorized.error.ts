import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 401 Unauthorized
 *
 * Specifically for use when authentication is required and has failed or has not yet been provided
 * */
export class UnauthorizedError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Unauthorized', 401, opt);
    }
}
