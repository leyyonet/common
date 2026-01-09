const literals = ['string', 'number', 'boolean'] as const;
/**
 * Primitive
 * */
export type Primitive = typeof literals[number];
export const PrimitiveItems = literals as ReadonlyArray<Primitive>;
