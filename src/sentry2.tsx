import * as Sentry from '@sentry/react';
import React from 'react';
import {
    createBrowserRouter,
    createRoutesFromChildren,
    matchRoutes,
    useLocation,
    useNavigationType,
} from 'react-router-dom';
import { captureConsoleIntegration } from '@sentry/react';
import { Env, getEnv } from './utils/envUtil';

Sentry.init({
    allowUrls: [/https:\/\/cdn\.nav\.no/],
    denyUrls: [/https:\/\/cdn\.nav\.no\/personbruker/, /https:\/\/nav\.no\/dekoratoren/],
    dsn: 'https://e1ba5c07ce204508b9fcbe5c64211ed5@sentry.gc.nav.no/173',
    integrations: [
        Sentry.reactRouterV6BrowserTracingIntegration({
            useEffect: React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
        Sentry.httpClientIntegration({
            failedRequestTargets: [
                /https:\/\/pto\.ekstern\.dev\.nav\.no\/arbeid\/dialog\/(veilarbdialog|veilarboppfolging|veilarbaktivitet|veilarblest)\/*/,
                /https:\/\/nav\.no\/arbeid\/dialog\/(veilarbdialog|veilarboppfolging|veilarbaktivitet|veilarblest)\/*/,
            ],
        }),
        captureConsoleIntegration({
            // array of methods that should be captured
            // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
            levels: ['warn', 'error'],
        }),
    ],
    tracePropagationTargets: [
        'localhost',
        /https:\/\/nav\.no\/arbeid\/dialog\/(veilarbdialog|veilarboppfolging|veilarbaktivitet|veilarblest)/,
        /https:\/\/pto\.ekstern\.dev\.nav\.no\/arbeid\/dialog\/(veilarbdialog|veilarboppfolging|veilarbaktivitet|veilarblest)/,
    ],
    environment: getEnv(),
    enabled: getEnv() !== Env.Local,
    ignoreErrors: [
        /Amplitude/,
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
    tracesSampleRate: 0.2,
    // beforeSend: fjernPersonopplysninger,
    release: import.meta.env.VITE_SENTRY_RELEASE,
});

declare const window: {
    location: { hostname: string };
    captureException: typeof Sentry.captureException;
    captureMessage: typeof Sentry.captureMessage;
};
window.captureException = Sentry.captureException;
window.captureMessage = Sentry.captureMessage;

export const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter);
