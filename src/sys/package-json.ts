import * as fs from "node:fs";
import path from "node:path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getRootStorage } from "./leyyo-storage.js";

export interface PackageJson {
  PCK: string;
  NAME: string;
  VER: string;
}
export interface PackageRepo {
  PCK: string;
  NAME: string;
  VERS: [string];
}
interface _PackageJson {
  name: string;
  version: string;
}
const _NAME = "$$leyyo.packages";
const _empty = { PCK: "leyyo.unknown", NAME: "@leyyo/unknown", VER: "0.0.0" } as PackageJson;
const _map = getRootStorage<Map<string, PackageRepo>>(_NAME, new Map());

export function packageJson(url: string): PackageJson {
  try {
    const __dirname = dirname(dirname(fileURLToPath(url)));
    const jsonPath = path.normalize(__dirname + "/package.json");
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
            return { PCK, NAME, VER };
          }
          console.warn(
            `Same package[${NAME}] duplicated, url: ${url}, current: ${VER}, previous versions: ${item.VERS.join(", ")}`,
          );
          item.VERS.push(VER);
        } else {
          _map.set(NAME, { PCK, NAME, VERS: [VER] });
        }
        return { PCK, NAME, VER };
      }
    }
  } catch (e) {
    console.error(`[packageJson] ${e.name} => ${e.message}`);
    return _empty;
  }
}
