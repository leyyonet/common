import {leyyo} from "./base";
import {FQN} from "./internal";


// noinspection JSUnusedGlobalSymbols
export const foretell_leyyoCommon = [
    // errors
    () => leyyo.errorPool.register({
            name: 'CausedError',
            fqn: FQN,
            i18n: true,
            emit: true,
            lazyTarget: import('./error').then(m => m.CausedError)
        }
    ),
    () => leyyo.errorPool.register({
            name: 'DeveloperError',
            fqn: FQN,
            i18n: false,
            emit: true,
            lazyTarget: import('./error').then(m => m.DeveloperError)
        }
    ),
    () => leyyo.errorPool.register({
            name: 'CausedError',
            fqn: FQN,
            i18n: true,
            emit: true,
            lazyTarget: import('./error').then(m => m.CausedError)
        }
    ),
    () => leyyo.errorPool.register({
            name: 'CausedError',
            fqn: FQN,
            i18n: true,
            emit: true,
            lazyTarget: import('./error').then(m => m.CausedError)
        }
    ),
    () => leyyo.errorPool.register({
            name: 'CausedError',
            fqn: FQN,
            i18n: true,
            emit: true,
            lazyTarget: import('./error').then(m => m.CausedError)
        }
    ),
    () => leyyo.errorPool.register({
            name: 'CausedError',
            fqn: FQN,
            i18n: true,
            emit: true,
            lazyTarget: import('./error').then(m => m.CausedError)
        }
    ),

    // enums
    () => leyyo.literalPool.register({
            name: 'LogLevel',
            fqn: FQN,
            i18n: true,
            lazyTarget: import('./enum').then(m => m.LogLevelItems)
        }
    )
];
