// noinspection JSUnusedGlobalSymbols

// region properties
/**
 * Is test?
 * */
let _isTest: boolean;

// endregion properties

/**
 * Initialize test
 * */
export function initTest(): void {
    _isTest = true;
    if (global) {
        if ( !global.leyyo_is_testing) {
            global.leyyo_is_testing = true;

            ['log', 'warn', 'info', 'debug', 'trace', 'error', 'fatal'].forEach(name => {
                global.console[name] = (): void => {
                };
                console[name] = (): void => {
                };
            });

        }
    }
}

/**
 * Is test?
 *
 * @return {boolean}
 * */
export function isTest(): boolean {
    return _isTest;
}





