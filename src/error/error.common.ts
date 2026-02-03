import type {ErrorCastType, ErrorCommonLike, ErrorCommonSecure, LeyyoErrorLike} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {ClassLike} from "../shared";
import type {Opt} from "../opt";
import {LeyyoError} from "./items";
import {SilentError} from "./items";
import {CausedError} from "./items";
import * as stackTraceParser from "stacktrace-parser";
import {FQN} from "../internal";

// noinspection JSUnusedLocalSymbols
export class ErrorCommon implements ErrorCommonLike, ErrorCommonSecure {
    private _knownPackages: Map<string, string>; // package-name, short name

    constructor(private lyy: LeyyoLike) {
    }

    register(cls: ClassLike, fqn?: string): void { // @todo ClassLike<LeyyoErrorLike>
        this.lyy.event.emit('ly:error:register', cls, fqn);
    }

    protected _copyProperties(err: LeyyoErrorLike, e: Error): void {
        for (const [k, v] of Object.entries(e)) {
            if ( !['name', 'message', 'stack'].includes(k) && (typeof k === 'string') && !['symbol', 'function', 'undefined'].includes(typeof v)) {
                this.lyy.opt.add(err.params, k, v);
            }
        }
    }
    castForClass<E extends LeyyoErrorLike>(clazz: ClassLike<E>, e: Error, opt?: Opt): E {
        const err = new clazz(e.message, opt);
        this._copyProperties(err, e);
        err.params = this.lyy.opt.append(err.params, opt);
        err.causedBy = e;
        return err;
    }
    cast(e: Error, o: Opt = {}, type: ErrorCastType = 'leyyo'): LeyyoErrorLike {
        let err: LeyyoErrorLike;
        if ( !(e instanceof LeyyoError)) {
            switch (type) {
                case "caused":
                    err = new CausedError(e.message, o, e);
                    break;
                case "silent":
                    err = new SilentError(e, o);
                    break;
                default:
                    err = new LeyyoError(e.message, o);
                    err.causedBy = e;
                    break;
            }
            this._copyProperties(err, e);
        }
        else {
            err = e;
            err.params = this.lyy.opt.append(err.params, o);
        }
        return err;
    }

    addKnownPackage(packageName: string, shortName: string): void {
        if (typeof packageName !== 'string' || packageName.trim() !== packageName || packageName.trim() === '') {
            throw new LeyyoError('Invalid package name', {where: `${FQN}.ErrorCommon`, method: 'addKnownPackage', value: packageName, field: 'packageName'});
        }
        if (typeof shortName !== 'string' || shortName.trim() !== shortName || shortName.trim() === '') {
            throw new LeyyoError('Invalid short name', {where: `${FQN}.ErrorCommon`, method: 'addKnownPackage', value: shortName, field: 'shortName'});
        }
        this._knownPackages.set(packageName, shortName);
    }
    stack(source: LeyyoErrorLike, force?: boolean): void {
        if (!force && Array.isArray(source.stackTrace)) {
            return;
        }
        source.stackTrace = [];
        try {
            let causedBy: Error;
            if (source.causedBy) {
                if (Array.isArray(source.causedBy) && source.causedBy.length > 0) {
                    causedBy = source.causedBy[0];
                }
                else if (source.causedBy instanceof Error) {
                    causedBy = source.causedBy;
                }
            }
            const original = causedBy?.stack ?? source.stack;
            if (original) {
                const frames = stackTraceParser.parse(original);
                if (Array.isArray(frames)) {
                    frames.forEach(frame => {
                        if (['<unknown>', 'Object.<anonymous>'].includes(frame.methodName)) {
                            frame.methodName = undefined;
                        }
                        if (frame.file) {
                            if (frame.file.startsWith('node:')) {
                                frame.file = `@` + frame.file.substring(5);
                            }
                            else {
                                for (const [pck, short] of this._knownPackages.entries()) {
                                    const index = frame.file.indexOf(pck);
                                    if (index >= 0) {
                                        frame.file = `#${short}` + frame.file.substring(index);
                                    }
                                }
                            }
                            if (frame.file.endsWith('.js') || frame.file.endsWith('.ts')) {
                                frame.file.substring(0, frame.file.length - 3);
                            }
                        }
                        source.stackTrace.push({
                            file: frame.file,
                            method: frame.methodName,
                            pos: `${frame.lineNumber ?? ''}:${frame.column ?? ''}`
                        });
                    });
                }
            }
        } catch (e) {
            // none
        }
    }

    // region secure
    // noinspection JSUnusedGlobalSymbols
    get $back(): ErrorCommonLike {
        return this;
    }

    $init(): void {
        this._knownPackages = this.lyy.repo.newMap<string, string>(`${FQN}.ErrorCommon.knownPackages`);
        this._knownPackages.set('@leyyo', 'l');

        this.lyy.$secure
            .$earlyRun(() => {
                LeyyoError.$setLeyyo(this.lyy);
            });
    }

    get $secure(): ErrorCommonSecure {
        return this;
    }
    // endregion secure
}
