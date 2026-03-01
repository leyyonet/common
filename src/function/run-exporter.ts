import { $$_get_leyyo_fn } from "./internal.js";
import { LeyyoLike } from "../type.js";
import { ExporterData, ExporterDepot, ExporterValue } from "../type.js";

let _leyyo: LeyyoLike;

// noinspection JSUnusedGlobalSymbols
/**
 * Run exporter
 *
 * @return {Promise<ExporterData>}
 * */
export async function runExporter(): Promise<ExporterData> {
  const data: ExporterData = {};
  const depot: ExporterDepot = {
    add(name: string, value: ExporterValue) {
      append(data, name, value, 0);
    },
  };
  if (!_leyyo) {
    _leyyo = $$_get_leyyo_fn();
  }
  await _leyyo.lifecycleCommon.runStage("print", depot);
  return data;
}

/**
 * Append to exporter with preventing overridden keys
 *
 * @param {ExporterData} data
 * @param {string} name
 * @param {ExporterValue} value
 * @param {number} duplicated
 * */
const append = (
  data: ExporterData,
  name: string,
  value: ExporterValue,
  duplicated: number,
): void => {
  const postfix = duplicated === 0 ? "" : "#" + duplicated;
  if (data[name + postfix] !== undefined) {
    data[name + postfix] = value;
  } else {
    append(data, name, value, duplicated + 1);
  }
};
