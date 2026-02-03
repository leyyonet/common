import type {ClassLike} from "../shared";
import {
    BadRequestError, ConflictError, ContentTooLargeError,
    ForbiddenError, GoneError,
    HttpError, LengthRequiredError,
    MethodNotAllowedError,
    NotAcceptableError,
    NotFoundError,
    PaymentRequiredError, PreconditionFailedError, ProxyAuthenticationRequiredError, RequestTimeoutError,
    UnauthorizedError
} from "./items";

// noinspection JSUnusedGlobalSymbols
/**
 * Http error map to use easy
 * */
export const HttpErrorMap: Record<number, ClassLike<HttpError>> = {
    400: BadRequestError,
    401: UnauthorizedError,
    402: PaymentRequiredError,
    403: ForbiddenError,
    404: NotFoundError,
    405: MethodNotAllowedError,
    406: NotAcceptableError,
    407: ProxyAuthenticationRequiredError,
    408: RequestTimeoutError,
    409: ConflictError,
    410: GoneError,
    411: LengthRequiredError,
    412: PreconditionFailedError,
    413: ContentTooLargeError,
}
