// noinspection JSUnusedGlobalSymbols
import {init} from "./init/index.js";
import {leyyo} from "./base/index.js";
import {setFqn} from "./function/index.js";
import {FQN} from "./internal.js";
import {List} from "./class/index.js";
import {LoggerInstance} from "./class/logger.instance.js";

init();

export const deployCommon = leyyo.deployCommon;
export const enumPool = leyyo.enumPool;
export const errorCommon = leyyo.errorCommon;
export const errorPool = leyyo.errorPool;
export const eventCommon = leyyo.eventCommon;
export const literalPool = leyyo.literalPool;
export const lifecycleCommon = leyyo.lifecycleCommon;
export const logCommon = leyyo.logCommon;
export const repoCommon = leyyo.repoCommon;

setFqn(deployCommon.constructor, FQN);
setFqn(enumPool.constructor, FQN);
setFqn(errorCommon.constructor, FQN);
setFqn(errorPool.constructor, FQN);
setFqn(eventCommon.constructor, FQN);
setFqn(literalPool.constructor, FQN);
setFqn(lifecycleCommon.constructor, FQN);
setFqn(logCommon.constructor, FQN);
setFqn(repoCommon.constructor, FQN);
setFqn(LoggerInstance, FQN);
setFqn(List, FQN);

export * from './base/index.js';
export * from './class/index.js';
export * from './common/index.js';
export * from './const/index.js';
export * from './enum/index.js';
export * from './error/index.js';
export * from './function/index.js';
export * from './sys/index.js';

export * from './index.loader.js';
export * from './index.foretell.js';
