import type {TestCommonLike, TestCommonSecure} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import {FQN} from "../internal";

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
export class TestCommon implements TestCommonLike, TestCommonSecure {
    private _is: boolean;

    constructor(private lyy: LeyyoLike) {
    }

    get $back(): TestCommonLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, TestCommon, 'class', FQN);
        });
    }

    get $secure(): TestCommonSecure {
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
