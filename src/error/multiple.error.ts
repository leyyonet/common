import {LeyyoErrorLike} from "./index.types";
import {LeyyoError} from "./leyyo.error";
import {CausedError} from "./caused.error";

// noinspection Annotator
/**
 * Multiple error which manages multiple errors
 * */
export class MultipleError extends LeyyoError {
    causedBy: Array<LeyyoErrorLike>;

    /**
     * @param {...Error[]} errors
     * */
    constructor(...errors: Array<Error>) {
        const first = errors.length > 0 ? errors[0] : undefined;
        super(first?.message ?? 'Multiple error', {});
        this.causedBy = [];
        this.push(...errors);
    }

    push(...errors: Array<Error>): this {
        errors.forEach(e => {
            if (e instanceof MultipleError) {
                this.causedBy.push(...e.causedBy);
            }
            else if (e instanceof LeyyoError) {
                this.causedBy.push(e);
            }
            else {
                this.causedBy.push(CausedError.of(e));
            }
        })
        return this;
    }
}
