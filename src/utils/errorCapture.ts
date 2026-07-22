/* Capture error without importing sentry */

/* Make sure to not import sentry for types, just create a similar type */
import { ClientError, ForbiddenError, InternalServerError, NetworkError, UnautorizedError } from './fetchErrors';

declare const window: {
    captureException: (exception: any) => void;
    captureMessage: (message: string) => void;
};

export const captureException = (exception: Error) => {
    if (window.captureException) {
        window.captureException(exception);
    }
};
export const captureMessage = (message: string) => {
    if (window.captureMessage) {
        window.captureMessage(message);
    }
};

export const captureMaybeError = (errorMessage: string, error: Error | any) => {
    if (
        error instanceof UnautorizedError ||
        error instanceof ForbiddenError ||
        error instanceof ClientError ||
        error instanceof InternalServerError ||
        error instanceof NetworkError
    ) {
        error.message = errorMessage;
        captureException(error);
    }
    if (error instanceof Error) {
        captureException(new Error(errorMessage, { cause: error }));
    } else {
        captureMessage(errorMessage);
    }
};
