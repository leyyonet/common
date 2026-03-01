import { Obj } from "../type.js";

/**
 * Inner secure json function, it will be used after creating weak set
 *
 * @param {any} value
 * @param {number} depth
 * @param {WeakSet} set
 * */
function _secureObject(value: unknown, depth: number, set: WeakSet<Obj>): unknown {
  if ([null, undefined].includes(value)) {
    return value;
  }
  let obj: Obj;
  switch (typeof value) {
    case "object":
      if (set.has(value)) {
        return `#circular <${value?.constructor?.name}>`;
      }
      if (depth >= 10) {
        return `#depth <${value?.constructor?.name}>`;
      }
      set.add(value);
      if (Array.isArray(value)) {
        return value.map((item) => _secureObject(item, depth + 1, set));
      }
      if (value instanceof Set) {
        return Array.from(value).map((item) => _secureObject(item, depth + 1, set));
      }
      obj = {};
      if (value instanceof Map) {
        for (const [k, v] of value.entries()) {
          if (typeof k === "string") {
            obj[k] = _secureObject(v, depth + 1, set);
          }
        }
      } else if (value?.constructor === Object) {
        for (const [k, v] of Object.entries(value)) {
          if (typeof k === "string") {
            obj[k] = _secureObject(v, depth + 1, set);
          }
        }
      } else {
        let exists: boolean;
        for (const [k, v] of Object.entries(value)) {
          if (
            typeof k === "string" &&
            !["function", "symbol", "undefined"].includes(typeof value)
          ) {
            exists = true;
            obj[k] = _secureObject(v, depth + 1, set);
          }
        }
        if (!exists) {
          try {
            return JSON.parse(JSON.stringify(value));
          } catch (e) {
            return `#parse <${value?.constructor?.name}>`;
          }
        }
      }
      return obj;
    case "function":
      return `#function <${value.name}> (length: ${value.length})`;
    case "symbol":
      return `#symbol <${value.description}>`;
  }
  return value;
}

// noinspection JSUnusedGlobalSymbols
/**
 * Converts an object to secure object
 *
 * - `secure` means:
 * - removes `circular` relations
 * - cuts after max depths, default: `10`
 * - converts `Set` to `array`
 * - converts `Map` to `object`
 * - cuts `methods` of an object
 * - cuts `symbol` properties of an object
 * - cuts `non-string keys` of an object
 * - cuts `undefined` properties of an object
 *
 * @param {any} value
 * @return {any}
 * */
export function secureObject<E>(value: E): E {
  try {
    return _secureObject(value, 0, new WeakSet<Obj>()) as E;
  } catch (e) {
    return `#error <${e.name}> (message: ${e.message})` as E;
  }
}

// noinspection JSUnusedGlobalSymbols
/**
 * Converts an object to secure string
 *
 * - `secure` means:
 * - removes `circular` relations
 * - cuts after max depths, default: `10`
 * - converts `Set` to `array`
 * - converts `Map` to `object`
 * - cuts `methods` of an object
 * - cuts `symbol` properties of an object
 * - cuts `non-string keys` of an object
 * - cuts `undefined` properties of an object
 *
 * Note:
 * `JSON.stringify` can fail if there is a `dependency
 *
 * @param {any} value
 * @return {string}
 * */
export function secureJson(value: unknown): string {
  try {
    const json = _secureObject(value, 0, new WeakSet<Obj>());
    return typeof json === "string" ? json : JSON.stringify(json);
  } catch (e) {
    return `#error <${e.name}> (message: ${e.message})`;
  }
}
