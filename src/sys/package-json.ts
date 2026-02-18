import * as fs from "node:fs";
import path from "node:path";
import {dirname} from "path";
import {fileURLToPath} from "url";
import {getRootStorage} from "./leyyo-storage.js";

export interface PackageJson {
    fqn: string;
    name: string;
    version: string;
    [k: string]: unknown;
}
const _NAME = '$$leyyo.packages';
const _empty = {fqn: 'leyyo.unknown', name: '@leyyo/unknown', version: '0.0.0'};
const _map = getRootStorage<Map<string, Array<string>>>(_NAME, new Map());

export function packageJson<P extends PackageJson = PackageJson>(url: string): P;
export function packageJson<P extends PackageJson = PackageJson>(url: string, full: true): P;
export function packageJson<P extends PackageJson = PackageJson>(url: string, full?: true): P {
    try {
        const __dirname = dirname(dirname(fileURLToPath(url)));
        const jsonPath = path.normalize(__dirname + '/package.json');
        if (fs.existsSync(jsonPath)) {
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, {encoding: 'utf-8', flag: 'r'})) as P;
            if (jsonData) {
                if (!jsonData?.name) {
                    return _empty as P;
                }
                const name = jsonData.name;
                const version = jsonData.version;
                if (_map.has(name)) {
                    if (Array.isArray(_map.get(name))) {
                        console.warn(`Same package[${name}] duplicated, current: ${version}, previous versions: ${JSON.stringify(_map.get(name))}`);
                    }
                    else {
                        _map.set(name, []);
                    }
                }
                else {
                    _map.set(name, []);
                }
                _map.get(name).push(version);
                const fqn = jsonData?.name.split('/').join('.').split('@').join('');
                if (full) {
                    return {...jsonData, fqn};
                }
                return {
                    fqn,
                    name: jsonData?.name,
                    version: jsonData?.version,
                } as P;
            }
        }
    } catch (e) {
        console.error(`[packageJson] ${e.name} => ${e.message}`);
        return _empty as P;
    }
}
