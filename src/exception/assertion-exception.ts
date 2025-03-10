import {Exception} from "./exception";
import {AssertionOpt} from "../shared";

// noinspection Annotator
export class AssertionException extends Exception {
    constructor(indicator?: string, params?: AssertionOpt) {
        super(indicator, {...params, indicator});
    }
}
