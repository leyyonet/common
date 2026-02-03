import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 413 Content Too Large
 *
 * The request is larger than the server is willing or able to process.
 * */
export class ContentTooLargeError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Content too large', 413, opt);
    }
}
