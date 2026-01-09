const literals = ['string', 'number', 'bigint', 'boolean', 'object', 'function'] as const;
/**
 * Real Value
 * */
export type RealValue = typeof literals[number];
export const RealValueItems = literals as ReadonlyArray<RealValue>;
