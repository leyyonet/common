import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 412 Precondition Failed
 *
 * The server does not meet one of the preconditions that the requester put on the request header fields.
 * */
export class PreconditionFailedError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Precondition failed', 412, opt);
    }
}
