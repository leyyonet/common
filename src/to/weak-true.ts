/**
 * Weak True
 * */
const literals = ['1', 'true', 't', 'yes', 'y', 'on'] as const;
export type WeakTrue = typeof literals[number];
export const WeakTrueItems = literals as ReadonlyArray<WeakTrue>;
