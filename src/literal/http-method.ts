/**
 * Http Method items
 * */
export const HttpMethodItems = ['delete', 'get', 'head', 'link', 'options', 'patch', 'post', 'purge', 'put', 'unlink'] as const;
// noinspection JSUnusedGlobalSymbols
/**
 * Http Method
 * */
export type HttpMethod = typeof HttpMethodItems[number];
