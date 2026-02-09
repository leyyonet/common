import {runLifecycleStage} from "./lifecycle.fn";
import {ExporterData, ExporterDepot, ExporterValue} from "../index.types";

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
        }
    };
    await runLifecycleStage('print', depot);
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
const append = (data: ExporterData, name: string, value: ExporterValue, duplicated: number): void => {
    const postfix = (duplicated === 0) ? '' : '#' + duplicated;
    if (data[name + postfix] !== undefined) {
        data[name + postfix] = value;
    }
    else {
        append(data, name, value, duplicated + 1);
    }
}
