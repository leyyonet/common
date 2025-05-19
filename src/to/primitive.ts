/**
 * Primitive items
 * */
export const PrimitiveItems = ['string', 'number', 'boolean'] as const;
/**
 * Primitive
 * */
export type Primitive = typeof PrimitiveItems[number];
