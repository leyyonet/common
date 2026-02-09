import {LeyyoError} from "./leyyo.error";
import {LY_ERROR_DEFAULT_MESSAGE} from "../const";

/**
 * Invalid value error
 * */
export class InvalidValueError extends LeyyoError {

    static {
        this[LY_ERROR_DEFAULT_MESSAGE] = 'Invalid value';
    }
}
