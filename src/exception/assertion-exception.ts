import {Exception} from "./exception";
import {DevOpt} from "../developer";

// noinspection Annotator
export class AssertionException extends Exception {
    constructor(issue?: string, params?: DevOpt) {
        super(issue, {...params, issue});
    }
}
