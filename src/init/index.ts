export function init() {
    if (global.console) {
        global.console['fatal'] = (...args: Array<unknown>) => console.error(...args);
    }
    if (console) {
        console['fatal'] = (...args: Array<unknown>) => console.error(...args);
    }
    if (global?.leyyo_is_testing) {
        ['log', 'debug', 'trace', 'info', 'warn', 'error', 'fatal'].forEach(name => {
            if (global?.console) {
                global.console[name] = (): void => {
                };
            }
            if (console) {
            }
            console[name] = (): void => {
            };
        });
    }
}
