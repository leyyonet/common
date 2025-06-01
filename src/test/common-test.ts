import {CommonTestLike, CommonTestSecure} from "./index.types";
import {LeyyoLike} from "../leyyo";
import {FQN} from "../internal";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class CommonTest implements CommonTestLike, CommonTestSecure {
    private lyy: LeyyoLike;
    private _is: boolean;
    constructor() {
    }

    get $back(): CommonTestLike {
        return this;
    }

    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonTest, 'class', FQN);
        });
    }

    get $secure(): CommonTestSecure {
        return this;
    }

    title(testCase: string|number, title: string): string {
        return `${testCase} >> ${title}`;
    }
    code(pck: string, testCase: string|number): string {
        pck = (['string', 'number'].includes(typeof pck)) ? pck : FQN;
        testCase = (['string', 'number'].includes(typeof testCase)) ? testCase : 'XXX';
        return `${pck}#${testCase}`;
    }
    get is(): boolean {
        return this._is;
    }
    $ok(): void {
        this._is = true;
        if (global) {
            if (!global.leyyo_is_testing) {
                global.leyyo_is_testing = true;
                this.lyy.hook.$secure.$clearTimeout();

                ['log', 'warn', 'info', 'debug', 'trace', 'error', 'native'].forEach(name => {
                    global.console[name] = (): void => {
                    };
                    console[name] = (): void => {
                    };
                });

            }
        }
    }
}
