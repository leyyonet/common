const _NAME = '$$leyyo.packages';

type LeyyoStorage = Map<string, unknown>;
/**
 * Create a standalone storage
 *
 * @return {LeyyoStorage}
 * */
function _new(): LeyyoStorage {
    return new Map<string, unknown>();
}

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
    if (source[_NAME] && source[_NAME] instanceof Map) {
        return source[_NAME];
    }
    source[_NAME] = _new();
    return source[_NAME];
}

/**
 * Build storage
 *
 * @return {LeyyoStorage}
 * */
function _build(): LeyyoStorage {
    try {
        return _get(globalThis) ?? _get(global) ?? _new();
    } catch (e) {
        return _new();
    }
}

/**
 * Local storage for leyyo platform
 * */
export const leyyoStorage = _build();

/**
 * @param {string} name - name of storage
 * @param {any} def - initial value
 * */
export function getRootStorage<T>(name: string, def:T): T {
    if (typeof name !== 'string') {
        throw new Error('Invalid storage name', name);
    }
    if (leyyoStorage.has(name)) {
        return leyyoStorage.get(name) as T;
    }

    if (!def || typeof def !== 'object') {
        throw new Error('Invalid storage value', def);
    }
    leyyoStorage.set(name, def);
    return def;
}
