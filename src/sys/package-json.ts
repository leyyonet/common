import * as fs from "node:fs";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getRootStorage } from "./leyyo-storage.js";

export interface PackageJson {
  PCK: string;
  NAME: string;
  PWD: string;
  VER: string;
}
export interface PackageRepo {
  PCK: string;
  NAME: string;
  PWD: string;
  VERS: [string];
}
interface _PackageJson {
  name: string;
  version: string;
}
const KEY_SYS_PACKAGES = Symbol.for("leyyo:storage:packages");
const _empty = { PCK: "leyyo.unknown", NAME: "@leyyo/unknown", VER: "0.0.0" } as PackageJson;
const _map = getRootStorage<Map<string, PackageRepo>>(KEY_SYS_PACKAGES, new Map());

export function packageJson(url: string): PackageJson {
  try {
    const PWD = dirname(dirname(fileURLToPath(url)));
    const jsonPath = path.normalize(PWD + "/package.json");
    if (fs.existsSync(jsonPath)) {
      const jsonData = JSON.parse(
        fs.readFileSync(jsonPath, { encoding: "utf-8", flag: "r" }),
      ) as _PackageJson;
      if (jsonData) {
        if (!jsonData?.name) {
          return _empty;
        }
        const NAME = jsonData.name;
        const VER = jsonData.version;
        const PCK = NAME.split("/").join(".").split("@").join("");
        if (_map.has(NAME)) {
          const item = _map.get(NAME);
          if (item.VERS.includes(VER)) {
            return { PCK, NAME, VER, PWD };
          }
          console.warn(
            `Same package[${NAME}] duplicated, url: ${url}, current: ${VER}, previous versions: ${item.VERS.join(", ")}`,
          );
          item.VERS.push(VER);
        } else {
          _map.set(NAME, { PCK, NAME, PWD, VERS: [VER] });
        }
        return { PCK, NAME, PWD, VER };
      }
    }
  } catch (e) {
    console.error(`[packageJson] ${e.name} => ${e.message}`);
    return _empty;
  }
}
