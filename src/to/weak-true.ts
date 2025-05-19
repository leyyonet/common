/**
 * Weak True items
 * */
export const WeakTrueItems = ['1', 'true', 't', 'yes', 'y', 'on'] as const;
/**
 * Weak True
 * */
export type WeakTrue = typeof WeakTrueItems[number];
