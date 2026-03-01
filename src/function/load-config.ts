import * as fs from "node:fs";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as yaml from "js-yaml";
import { LeyyoConfig } from "../type.js";
import { isObj } from "./is-obj.js";
import { getRootStorage } from "../sys/index.js";
import { isText } from "./is-text.js";
import { isEmpty } from "./is-empty.js";
import { secureJson, secureObject } from "./secure-json.js";

const KEY_CONFIG = Symbol.for("leyyo:config");
export const leyyoConfig = getRootStorage<LeyyoConfig>(KEY_CONFIG, {});
type ConfigBehaviour = "merge" | "override";
/**
 * Load config from `.leyyo.yaml` file
 *
 * `OBJECT` postfixes:
 * - !: only override (`don't merge`)
 * - ?: only merge (`don't override`)
 * - <empty>: only set if key is absent
 *
 * `ARRAY` postfixes:
 * - !: only override (`don't merge`)
 * - ?: only merge (`don't override`)
 * - <empty>: only set if key is absent
 *
 * Generics:
 * - `C`- config model
 *
 * @param {string} url
 * @return {LeyyoConfig}
 * */
export function loadConfig(url: string): LeyyoConfig {
  try {
    const __dirname = dirname(dirname(fileURLToPath(url)));
    const yamlPath = path.normalize(__dirname + "/.leyyo.yaml");
    if (fs.existsSync(yamlPath)) {
      const input = fs.readFileSync(yamlPath, "utf8");
      const data = yaml.load(input) as LeyyoConfig;
      if (isObj(data)) {
        for (const [k, v] of Object.entries(data)) {
          _object(leyyoConfig, k, v);
        }
      }
      return leyyoConfig;
    }
  } catch (e) {
    console.error(`[leyyoConfig] ${e.name} => ${e.message}`);
    return undefined;
  }
}

/**
 * Get key behaviour
 * @param {string} keyFull - key
 * @return {Array} - tuple as `[behaviour, key]`
 * */
function _behaviour(keyFull: string): [ConfigBehaviour, string] {
  if (!isText(keyFull)) {
    return [undefined, undefined];
  }
  if (keyFull.endsWith("!")) {
    keyFull = keyFull.substring(keyFull.length - 1).trim();
    if (!isText(keyFull)) {
      return [undefined, undefined];
    }
    return ["override", keyFull];
  } else if (keyFull.endsWith("?")) {
    keyFull = keyFull.substring(keyFull.length - 1).trim();
    if (!isText(keyFull)) {
      return [undefined, undefined];
    }
    return ["merge", keyFull];
  }
  return [undefined, keyFull];
}

/**
 * Merge array
 *
 * @param {Array} source
 * @param {string} key
 * @param {Array} value
 * */
function _array<T>(source: Array<T>, key: string, value: Array<T>): void {
  value.forEach((item, index) => {
    if (isEmpty(item)) {
      console.warn(`[leyyoConfig] value empty at (${key}#${index})`);
      return;
    }
    const clonedSource = source.map((item) => JSON.stringify(item));
    switch (typeof item) {
      case "string":
      case "number":
      case "boolean":
        if (!clonedSource.includes(JSON.stringify(item))) {
          source.push(item);
        }
        break;
      case "object":
        if (!clonedSource.includes(secureJson(item))) {
          source.push(secureObject(item));
        }
        break;
      case "undefined":
      case "bigint":
      case "symbol":
      case "function":
        console.warn(`[leyyoConfig] type is not allowed at (${key}#${index})`);
        break;
    }
  });
}

/**
 * Merge object
 *
 * @param {object} source
 * @param {string} keyFull - key
 * @param {any} value
 * */
function _object<T>(source: Record<string, T>, keyFull: string, value: T): void {
  if (isEmpty(value)) {
    return;
  }
  const [behaviour, key] = _behaviour(keyFull);
  if (!key) {
    console.warn(`[leyyoConfig] key empty at (${keyFull})`);
    return;
  }
  if (!source) {
    source = {};
  }
  // old is empty
  if (isEmpty(source[key])) {
    switch (typeof value) {
      case "string":
      case "number":
      case "boolean":
        source[key] = value;
        break;
      case "object":
        source[key] = secureObject(value);
        break;
      case "function":
      case "symbol":
      case "bigint":
      case "undefined":
        console.warn(`[leyyoConfig] type is not allowed at (${key})`);
        break;
    }
    return;
  }

  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      switch (behaviour) {
        case "override":
          source[key] = value;
          break;
        default: // merge
          if (isEmpty(source[key])) {
            source[key] = value;
          }
          break;
      }
      break;
    case "object":
      // new is an array
      if (Array.isArray(value)) {
        // old is an array (BOTH)
        if (Array.isArray(source[key])) {
          switch (behaviour) {
            case "override":
              source[key] = secureObject(value);
              break;
            case "merge":
              _array(source[key], key, value);
              break;
            default:
              // old exists, ignore
              break;
          }
        }
        // CONFLICT: old is not array
        else {
          switch (behaviour) {
            case "override":
              source[key] = secureObject(value);
              break;
            case "merge":
              // old is different, conflict
              console.warn(`[leyyoConfig] type is conflicted at (${key})`);
              break;
            default:
              // old exists, ignore
              break;
          }
        }
      }
      // new is an object
      else {
        // CONFLICT: old is not object
        if (Array.isArray(source[key])) {
          switch (behaviour) {
            case "override":
              source[key] = value;
              break;
            case "merge":
              // old is different, conflict
              console.warn(`[leyyoConfig] type is conflicted at (${key})`);
              break;
            default:
              // old exists, ignore
              break;
          }
        }
        // old is an object (BOTH)
        else {
          switch (behaviour) {
            case "override":
              source[key] = value;
              break;
            case "merge":
              for (const [k, v] of Object.entries(value)) {
                _object(source[key], k, v);
              }
              break;
            default:
              // old exists, ignore
              break;
          }
        }
      }
      break;
    case "function":
    case "symbol":
    case "bigint":
    case "undefined":
      console.warn(`[leyyoConfig] type is not allowed at (${key})`);
      break;
  }
}
