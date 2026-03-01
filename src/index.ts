// noinspection JSUnusedGlobalSymbols
import { setFqn } from "./function/index.js";
import { $initLeyyo, PCK } from "./internal.js";
import { leyyo, List } from "./base/index.js";
import { LoggerInstance } from "./base/logger.instance.js";
import { LazyInstance } from "./base/lazy.instance.js";
import { PredictorInstance } from "./base/predictor.instance.js";

$initLeyyo();

export const deployCommon = leyyo.deployCommon;
export const enumPool = leyyo.enumPool;
export const errorCommon = leyyo.errorCommon;
export const errorPool = leyyo.errorPool;
export const eventCommon = leyyo.eventCommon;
export const literalPool = leyyo.literalPool;
export const lifecycleCommon = leyyo.lifecycleCommon;
export const logCommon = leyyo.logCommon;
export const repoCommon = leyyo.repoCommon;

setFqn(deployCommon.constructor, PCK);
setFqn(enumPool.constructor, PCK);
setFqn(errorCommon.constructor, PCK);
setFqn(errorPool.constructor, PCK);
setFqn(eventCommon.constructor, PCK);
setFqn(literalPool.constructor, PCK);
setFqn(lifecycleCommon.constructor, PCK);
setFqn(logCommon.constructor, PCK);
setFqn(repoCommon.constructor, PCK);
setFqn(leyyo.loggerInstance, PCK);
setFqn(LazyInstance, PCK);
setFqn(PredictorInstance, PCK);
setFqn(List, PCK);

export * from "./const.js";
export * from "./type.js";
export * from "./base/index.js";
export * from "./common/index.js";
export * from "./literal/index.js";
export * from "./error/index.js";
export * from "./function/index.js";
export * from "./sys/index.js";
export * from "./loader/index.js";
