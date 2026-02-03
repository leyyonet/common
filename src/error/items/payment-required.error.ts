import {HttpError} from "./http.error";
import type {Opt} from "../../opt";

/**
 * Http 402 Payment Required
 *
 * The original intention was that this code might be used as part of some form of digital cash or micropayment scheme
 * */
export class PaymentRequiredError extends HttpError {
    constructor(message?: string, opt?: Opt) {
        super(message ?? 'Payment required', 402, opt);
    }
}
