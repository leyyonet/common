import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 411 Length Required
 *
 * The request did not specify the length of its content, which is required by the requested resource.
 * */
export class LengthRequiredError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Length required', 411, opt);
    }
}
