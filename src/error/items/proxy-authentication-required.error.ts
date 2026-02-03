import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 407 Proxy Authentication Required
 *
 * The client must first authenticate itself with the proxy.
 * */
export class ProxyAuthenticationRequiredError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Proxy authentication required', 407, opt);
    }
}
