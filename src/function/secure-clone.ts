import { Obj } from "../type.js";

/**
 * Clones a value (object) with taking attention circular objects
 *
 * @param {(Obj|Array)} value
 * @param {WeakSet} weakSet - to handle circular objects
 * @return {(Obj|Array)}
 * */
function _secureClone<T>(value: T, weakSet: WeakSet<Obj>): T {
  if (value === undefined || value === null) {
    return value;
  }
  if (typeof value !== "object") {
    return value;
  }
  if (weakSet.has(weakSet)) {
    return value;
  }
  weakSet.add(value);
  if (Array.isArray(value)) {
    return value.map((item) => _secureClone(item, weakSet)) as T;
  }
  if (value instanceof Set) {
    return new Set(Array.from(value.values()).map((item) => _secureClone(item, weakSet))) as T;
  }
  if (value instanceof Map) {
    const newMap = new Map();
    for (const [k, v] of value.entries()) {
      newMap.set(k, _secureClone(v, weakSet));
    }
    return newMap as T;
  }
  const newObj = {};
  for (const [k, v] of Object.entries(value)) {
    newObj[k] = _secureClone(v, weakSet);
  }
  return newObj as T;
}

/**
 * Clones a value (object) with taking attention circular objects
 *
 * @param {(Obj|Array)} value
 * @return {(Obj|Array)}
 * */
export function secureClone<T>(value: T): T {
  return _secureClone(value, new WeakSet());
}
