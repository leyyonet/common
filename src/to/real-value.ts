/**
 * Real Value items
 * */
export const RealValueItems = ['string', 'number', 'bigint', 'boolean', 'object', 'function'] as const;
/**
 * Real Value
 * */
export type RealValue = typeof RealValueItems[number];
