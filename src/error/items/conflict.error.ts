import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 409 Conflict
 *
 * Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.
 * */
export class ConflictError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Conflict', 409, opt);
    }
}
