import {LeyyoError} from "./leyyo.error";
import type {LeyyoErrorLike} from "../index.types";

// noinspection Annotator
/**
 * Multiple error which manages multiple errors
 *
 * */
export class MultipleError extends LeyyoError {
    errors: Array<LeyyoErrorLike>;

    constructor(...errors: Array<Error>) {
        const first = errors.length > 0 ? errors[0] : undefined;
        super(first?.message ?? 'Multiple error', {});
        this.errors = [];
        this.push(...errors);
    }

    push(...errors: Array<Error>): this {
        errors.forEach(e => {
            if (e instanceof MultipleError) {
                this.errors.push(...e.errors);
            } else if (e instanceof LeyyoError) {
                this.errors.push(e);
            } else {
                this.errors.push(LeyyoError.$error.cast(e));
            }
        })
        return this;
    }
}
