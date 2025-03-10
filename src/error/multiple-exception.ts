import {ExceptionLike} from "./index-types";
import {Exception} from "./exception";

// noinspection Annotator
export class MultipleException extends Exception {
    protected _errors: Array<ExceptionLike>;

    constructor(...errors: Array<Error>) {
        const first = errors[0];
        super(first?.name ?? "Multiple exceptions are occurred", {});
        this._errors = [];
        this.push(...errors);
    }
    push(...errors: Array<Error>): this {
        errors.forEach(e => {
            if (e instanceof MultipleException) {
                this._errors.push(...e._errors);
            } else if (e instanceof Exception) {
                this._errors.push(e);
            } else {
                this._errors.push(Exception.$error.build(e));
            }
        })
        return this;
    }
    // noinspection JSUnusedGlobalSymbols
    get errors(): Array<ExceptionLike> {
        return [...this._errors]; // cloned response
    }
}
