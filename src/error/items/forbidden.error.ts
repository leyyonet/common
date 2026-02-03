import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 403 Forbidden
 *
 * The request was valid, but the server refuses action
 * */
export class ForbiddenError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Forbidden', 403, opt);
    }
}
