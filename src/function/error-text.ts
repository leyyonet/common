import {LY_ERROR_UNKNOWN_MESSAGE, LY_ERROR_UNKNOWN_NAME} from "../const";

/**
 * Build a standard error text
 * - if parts: `<info> [err:error.name] => [error.message]`
 * - else: `[err:error.name] => [error.message]`
 *
 * @param {Error} err - error instance
 * @param {...Array<string|number>} parts - parts for info
 * @return {string} - error text
 * */
export function errorText(err: Error, ...parts: Array<string | number>): string {
    const info = parts.length > 0 ? _buildTextParts(parts) : '';
    if (err instanceof Error) {
        return `${info}[err:${err?.name ?? LY_ERROR_UNKNOWN_NAME}] => ^/${err?.message ?? LY_ERROR_UNKNOWN_MESSAGE}/$`;
    }
    return `${info}[err:${LY_ERROR_UNKNOWN_NAME}] => ^/${LY_ERROR_UNKNOWN_MESSAGE}/$`;
}

/**
 * Build error info part as `<part1/part2>`
 *
 * @param {Array<string|number>} parts - parts for info
 * @return {string}
 * */
function _buildTextParts(parts: Array<string | number>): string {
    parts = parts.map(p => {
        if (typeof p === 'string') {
            p = p.trim();
            return (p) ? p : undefined;
        }
        else if (typeof p === 'number') {
            return p.toString(10);
        }
        else {
            return undefined;
        }
    }).filter(Boolean);
    return parts.length > 0 ? '<' + parts.join('/') + '> ' : '';
}
