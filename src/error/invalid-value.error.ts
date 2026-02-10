import {LeyyoError} from "./leyyo.error";
import {KEY_ERROR_DEFAULT_MESSAGE} from "../const";

/**
 * Invalid value error
 * */
export class InvalidValueError extends LeyyoError {

    static {
        this[KEY_ERROR_DEFAULT_MESSAGE] = 'Invalid value';
    }
}
