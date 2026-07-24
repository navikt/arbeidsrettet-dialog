import { getEnv } from './utils/envUtil';
import { init, captureMessage, captureException } from '@nais/apm';

init({
    app: 'arbeidsrettet-dialog',
    namespace: 'pto',
    environment: getEnv(),
    ignoreErrors: [
        // /^Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.$/,
        /**
         * React internal error thrown when something outside react modifies the DOM
         * This is usually because of a browser extension or Chrome's built-in translate
         */
        /Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node\./,
        /Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node./,
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    // beforeSend: fjernPersonopplysninger,
    tracing: true,
});

declare const window: {
    location: { hostname: string };
    captureException: typeof captureException;
    captureMessage: typeof captureMessage;
};
window.captureException = captureException;
window.captureMessage = captureMessage;
