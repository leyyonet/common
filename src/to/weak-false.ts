/**
 * Weak False items
 * */
export const WeakFalseItems = ['0', '-1', 'false', 'f', 'no', 'n', 'off'] as const;
/**
 * Weak False
 * */
export type WeakFalse = typeof WeakFalseItems[number];
