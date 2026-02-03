import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 400 Bad Request
 *
 * The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing).
 * */
export class BadRequestError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Bad request error', 400, opt);
    }
}
