import {FQN} from "./internal";
import {defineLazyEnum, defineLazyError, defineLoader} from "./common";

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
    () => import('./class').then(m => m.LoggerInstance),
);

// noinspection JSUnusedGlobalSymbols
export const foretell_leyyoCommon = [
    () => defineLazyError({
        name: 'CausedError',
        fqn: FQN,
        i18n: true,
        emit: true,
        lazyClass: import('./error').then(m => m.CausedError)}
    ),
    () => defineLazyError({
        name: 'DeveloperError',
        fqn: FQN,
        i18n: false,
        emit: true,
        lazyClass: import('./error').then(m => m.DeveloperError)}
    ),
    () => defineLazyError({
        name: 'CausedError',
        fqn: FQN,
        i18n: true,
        emit: true,
        lazyClass: import('./error').then(m => m.CausedError)}
    ),
    () => defineLazyError({
        name: 'CausedError',
        fqn: FQN,
        i18n: true,
        emit: true,
        lazyClass: import('./error').then(m => m.CausedError)}
    ),
    () => defineLazyError({
        name: 'CausedError',
        fqn: FQN,
        i18n: true,
        emit: true,
        lazyClass: import('./error').then(m => m.CausedError)}
    ),
    () => defineLazyError({
        name: 'CausedError',
        fqn: FQN,
        i18n: true,
        emit: true,
        lazyClass: import('./error').then(m => m.CausedError)}
    ),

    () => defineLazyEnum({
        name: 'LogLevel',
        fqn: FQN,
        i18n: true,
        lazyData: import('./enum').then(m => m.LogLevelItems)}
    )
];
