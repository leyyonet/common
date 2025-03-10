/**
 * Weak True items
 * */
export const StorageTypeItems = ['array', 'list', 'map', 'set'] as const;
/**
 * Storage type literal, as an enum
 * */
export type StorageType = typeof StorageTypeItems[number];
