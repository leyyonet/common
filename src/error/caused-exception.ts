import {Exception} from "./exception";
import {Dict} from "../aliases";

// noinspection Annotator
export class CausedException extends Exception {
    constructor(e: Error, indicator?: string, params?: Dict) {
        super(e.message, {...params, indicator});
        this.causedBy(e);
    }
}
