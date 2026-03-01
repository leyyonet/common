const KEY_STORAGE = Symbol.for("leyyo");

type LeyyoStorage = Map<symbol, unknown>;

/**
 * Get a global storage
 *
 * @param {any} source - `global` or `globalThis`
 * @return {LeyyoStorage}
 * */
function _get(source: unknown): LeyyoStorage {
  if (!source) {
    return undefined;
  }
  if (source[KEY_STORAGE] && source[KEY_STORAGE] instanceof Map) {
    return source[KEY_STORAGE];
  }
  return undefined;
}

/**
 * Build storage
 *
 * @return {LeyyoStorage}
 * */
function _build(): LeyyoStorage {
  try {
    return _get(globalThis) ?? _get(global) ?? new Map<symbol, unknown>();
  } catch (e) {
    return new Map<symbol, unknown>();
  }
}

/**
 * Local storage for leyyo platform
 * */
export const leyyoStorage = _build();

/**
 * @param {symbol} code - code of storage
 * @param {any} def - initial value
 * */
export function getRootStorage<T>(code: symbol, def: T): T {
  if (typeof code !== "symbol") {
    throw new Error("Invalid storage code", code);
  }
  if (leyyoStorage.has(code)) {
    return leyyoStorage.get(code) as T;
  }

  if (!def || typeof def !== "object") {
    throw new Error("Invalid storage value", def);
  }
  leyyoStorage.set(code, def);
  return def;
}
