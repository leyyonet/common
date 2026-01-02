import {Exception} from "./exception";
import type {DevOpt} from "../developer";

// noinspection Annotator
export class CausedException extends Exception {
    constructor(e: Error, opt?: DevOpt) {
        super(e.message, opt);
        this.causedBy(e);
    }
}
