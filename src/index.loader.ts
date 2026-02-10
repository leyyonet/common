import {defineLoader} from "./function";
import {FQN} from "./internal";


// noinspection JSUnusedGlobalSymbols
export const loader_leyyoCommon = defineLoader(FQN,
    // errors
    () => import('./error').then(m => m.CausedError),
    () => import('./error').then(m => m.DeveloperError),
    () => import('./error').then(m => m.HttpError),
    () => import('./error').then(m => m.InvalidValueError),
    () => import('./error').then(m => m.LeyyoError),
    () => import('./error').then(m => m.MultipleError),
    // enums
    () => import('./enum').then(m => m.LogLevelItems),
    // classes
    () => import('./class').then(m => m.List),
    () => import('./class/logger.instance').then(m => m.LoggerInstance),
);
