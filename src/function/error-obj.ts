import {ErrorObject} from "../index.types";
import {LY_ERROR_UNKNOWN_MESSAGE, LY_ERROR_UNKNOWN_NAME} from "../const";

// noinspection JSUnusedGlobalSymbols
/**
 * Build a standard error text
 *
 * @param {Error} err - error instance
 * @return {string} - error text
 * */
export function errorObj(err: Error): ErrorObject {
    if (err instanceof Error) {
        return {
            name: err.name ?? LY_ERROR_UNKNOWN_NAME,
            message: err.message ?? LY_ERROR_UNKNOWN_MESSAGE,
        };
    }
    return {
        name: LY_ERROR_UNKNOWN_NAME,
        message: LY_ERROR_UNKNOWN_MESSAGE,
    };
}

