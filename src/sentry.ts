// import { captureConsoleIntegration } from '@sentry/integrations';
// import * as Sentry from '@sentry/react';
// import { Breadcrumb, Event } from '@sentry/types';
// import React from 'react';
// import {
//     createRoutesFromChildren,
//     matchRoutes,
//     useLocation,
//     useNavigationType,
//     createBrowserRouter
// } from 'react-router-dom';
//
// export enum Env {
//     Local = 'local',
//     Dev = 'dev',
//     Prod = 'prod'
// }
//
// export const getEnv = (): string => {
//     const { hostname } = window.location;
//     if (hostname.includes('dev.nav.no')) return Env.Dev;
//     if (hostname.includes('nav.no')) return Env.Prod;
//     return Env.Local;
// };
//
// const fnrRegexRegel = {
//     regex: /[0-9]{11}/g,
//     erstatning: '&lt;fnr&gt;'
// };
//
// const maskerPersonopplysninger = (tekst?: string) => {
//     if (!tekst) return undefined;
//     return tekst.replace(fnrRegexRegel.regex, fnrRegexRegel.erstatning);
// };
//
// const toRoute = (route: string) => {
//     return route.replace(fnrRegexRegel.regex, '&#58;fnr');
// };
//
// const tagsFilter = (tags: Event['tags']): Event['tags'] => {
//     if (typeof tags !== 'object' || !('transaction' in tags) || !tags.transaction) return tags;
//     return {
//         ...tags,
//         transaction: toRoute(tags?.transaction as unknown as string)
//     };
// };
//
// const fjernPersonopplysninger = (event: Event): Event => {
//     const url = event.request?.url ? maskerPersonopplysninger(event.request.url) : '';
//     return {
//         ...event,
//         request: {
//             ...event.request,
//             url,
//             headers: {
//                 Referer: maskerPersonopplysninger(event.request?.headers?.Referer) || ''
//             }
//         },
//         tags: tagsFilter(event.tags),
//         breadcrumbs: (event.breadcrumbs || []).map((breadcrumb: Breadcrumb) => ({
//             ...breadcrumb,
//             message: maskerPersonopplysninger(breadcrumb.message),
//             data: {
//                 ...breadcrumb.data,
//                 url: maskerPersonopplysninger(breadcrumb.data?.url),
//                 from: maskerPersonopplysninger(breadcrumb.data?.from),
//                 to: maskerPersonopplysninger(breadcrumb.data?.to)
//             }
//         }))
//     };
// };
//
// Sentry.init({
//     dsn: 'https://e1ba5c07ce204508b9fcbe5c64211ed5@sentry.gc.nav.no/173',
//     integrations: [
//         new Sentry.BrowserTracing({
//             routingInstrumentation: Sentry.reactRouterV6Instrumentation(
//                 React.useEffect,
//                 useLocation,
//                 useNavigationType,
//                 createRoutesFromChildren,
//                 matchRoutes
//             ),
//             tracePropagationTargets: [
//                 'aktivitetsplan.nav.no',
//                 'aktivitetsplan.ekstern.dev.nav.no'
//                 // /(\.dev)?nav.no\/veilarbdialog/,
//                 // /(\.dev)?nav.no\/veilarboppfolging/,
//                 // /(\.dev)?nav.no\/veilarbaktivitet/,
//                 // /(\.dev)?nav.no\/veilarblest/,
//             ]
//         }),
//         captureConsoleIntegration({
//             // array of methods that should be captured
//             // defaults to ['log', 'info', 'warn', 'error', 'debug', 'assert']
//             levels: ['warn', 'error']
//         })
//     ],
//     allowUrls: [/https?:\/\/(cdn\.)?(ekstern\.)?(dev\.)?nav\.no/],
//     environment: getEnv(),
//     enabled: getEnv() !== Env.Local,
//     ignoreErrors: [
//         /^Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.$/,
//         /^Uventet feil fra dekoratøren: NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node. \[object Object]$/,
//         /^Uventet feil fra dekoratøren: NotFoundError: The object can not be found here. \[object Object]$/,
//         /^The object can not be found here.$/
//     ],
//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 0.2,
//     beforeSend: fjernPersonopplysninger,
//     release: import.meta.env.VITE_SENTRY_RELEASE
// });
//
// export const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter);
