import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 408 Request Timeout
 *
 * The server timed out waiting for the request. According to HTTP specifications
 * */
export class RequestTimeoutError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Request timeout', 408, opt);
    }
}
