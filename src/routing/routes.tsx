import AppBody from '../view/AppBody';
import NyDialogTrad from '../view/dialog/NyDialogTrad';
import { Aktivitetskort } from '../view/aktivitet/Aktivitetskort';
import { DialogTrad } from '../view/dialog/DialogTrad';
import IkkeValgtDialogMelding from '../view/dialog/IkkeValgtDialogMelding';
import { Navigate, RouteObject, RouterProvider, createMemoryRouter, useParams } from 'react-router';
import React from 'react';
import { erInternFlate, USE_HASH_ROUTER } from '../constants';
import { createBrowserRouter, createHashRouter, useSearchParams } from 'react-router-dom';
import { stripTrailingSlash } from '../api/UseApiBasePath';
import { initialPageLoader } from './loaders';
import { useFnrContext } from '../view/Provider';

const aktivitetQuery = (aktivitetId?: string) => (aktivitetId ? `?aktivitetId=${aktivitetId}` : '');

const baseRoute = () => '/';
const dialogRoute = (id: string) => `/${id}`;
const nyRoute = (aktivitetId: string | undefined = undefined) => `/ny${aktivitetQuery(aktivitetId)}`;
const informasjonRoute = () => '/informasjon';

export const useRoutes = () => {
    return {
        baseRoute,
        dialogRoute,
        nyRoute,
        informasjonRoute
    };
};

const RedirectToDialogWithoutFnr = () => {
    // /:fnr/:dialogId -> /:dialogId
    const params = useParams();
    return <Navigate replace to={`/` + params.dialogId} />;
};
const RedirectToNyDialogWithoutFnr = () => {
    // Handle route /:fnr/ny?aktivitetId=<id> -> /ny?aktivitetId=<id>
    const [queryParams, _] = useSearchParams();
    const aktivitetId = queryParams.get('aktivitetId');
    const queryPart = aktivitetId ? '?aktivitetId=' + aktivitetId : '';
    return <Navigate replace to={`/ny${queryPart}`} />;
};

export const dialogRoutes = (fnr: string | undefined): RouteObject[] => [
    {
        path: '/',
        id: 'root',
        element: <AppBody />,
        loader: initialPageLoader(fnr),
        children: [
            {
                path: 'ny',
                element: (
                    <>
                        <NyDialogTrad />
                        <Aktivitetskort />
                    </>
                )
            },
            {
                path: ':dialogId',
                element: (
                    <>
                        <DialogTrad />
                        <Aktivitetskort />
                    </>
                )
            },
            {
                path: '',
                element: <IkkeValgtDialogMelding />
            },
            {
                path: ':fnr/ny',
                element: <RedirectToNyDialogWithoutFnr />
            },
            {
                path: ':fnr/:dialogId',
                element: <RedirectToDialogWithoutFnr />
            },
            {
                path: '*',
                element: <Navigate to={'/'} />
            }
        ]
    }
];

export const Routes = () => {
    const fnr = useFnrContext();
    if (USE_HASH_ROUTER) {
        const hashRouter = createHashRouter(dialogRoutes(fnr));
        return <RouterProvider router={hashRouter} />;
    }
    if (process.env.NODE_ENV === 'test') {
        const inMemoryRouter = createMemoryRouter(dialogRoutes(fnr));
        return <RouterProvider router={inMemoryRouter} />;
    }
    let basename = stripTrailingSlash(import.meta.env.BASE_URL);
    if (erInternFlate) basename = `/dialog`;
    const browserRouter = createBrowserRouter(dialogRoutes(fnr), { basename });
    return <RouterProvider router={browserRouter} />;
};
