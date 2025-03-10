import {Exception} from "./exception";
import {AssertionOpt} from "../assertion";

// noinspection Annotator
export class AssertionException extends Exception {
    constructor(indicator?: string, params?: AssertionOpt) {
        super(indicator, {...params, indicator});
    }
}
