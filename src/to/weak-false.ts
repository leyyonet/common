const literals = ['0', '-1', 'false', 'f', 'no', 'n', 'off'] as const;
/**
 * Weak False
 * */
export type WeakFalse = typeof literals[number];
export const WeakFalseItems = literals as ReadonlyArray<WeakFalse>;
