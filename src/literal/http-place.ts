/**
 * Http Place items
 * */
export const HttpPlaceItems = ['query', 'body', 'header', 'path'] as const;
// noinspection JSUnusedGlobalSymbols
/**
 * Http Place
 * */
export type HttpPlace = typeof HttpPlaceItems[number];
