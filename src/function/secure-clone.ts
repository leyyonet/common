import {Obj} from "../base/index.js";

export function _secureClone<T>(value: T, weakSet: WeakSet<Obj>): T {
    if (value === undefined || value === null) {
        return value;
    }
    if (typeof value !== 'object') {
        return value;
    }
    if (weakSet.has(weakSet)) {
        return value;
    }
    weakSet.add(value);
    if (Array.isArray(value)) {
        return value.map(item => secureClone(item)) as T;
    }
    if (value instanceof Set) {
        return new Set(Array.from(value.values()).map(item => secureClone(item))) as T;
    }
    if (value instanceof Map) {
        const newMap = new Map();
        for (const [k, v] of value.entries()) {
            newMap.set(k, secureClone(v));
        }
        return newMap as T;
    }
    const newObj = {};
    for (const [k, v] of Object.entries(value)) {
        newObj[k] = secureClone(v);
    }
    return newObj as T;
}

export function secureClone<T>(value: T): T {
    return _secureClone(value, new WeakSet());
}
