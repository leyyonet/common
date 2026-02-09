import {LY_ERROR_UNKNOWN_MESSAGE, LY_ERROR_UNKNOWN_NAME} from "../const";

/**
 * Build a standard error text
 *
 * @param {Error} err - error instance
 * @return {string} - error text
 * */
export function errorText(err: Error): string {
    if (err instanceof Error) {
        return `[err:${err?.name ?? LY_ERROR_UNKNOWN_NAME}] => ^/${err?.message ?? LY_ERROR_UNKNOWN_MESSAGE}/$`;
    }
    return `[err:${LY_ERROR_UNKNOWN_NAME}] => ^/${LY_ERROR_UNKNOWN_MESSAGE}/$`;
}
