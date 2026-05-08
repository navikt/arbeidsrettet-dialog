import { createMemoryRouter, Outlet, RouterProvider } from 'react-router';
import { dialogRoutes, reactRouterFutureFlags, RouteIds } from '../routing/routes';
import React, { ReactElement } from 'react';
import { Provider } from '../view/Provider';
import { setupServer } from 'msw/node';
import { handlers } from '../mock/handlers';

export const setupIntegrationTest = (fnr: string | undefined, initialRouteEntries = ['/2']) => {
    const ProviderAndRouter = fullRouterAndProvider(fnr, initialRouteEntries);
    return {
        worker: setupServer(...handlers), // TODO: Handlers should mock
        App: () => <ProviderAndRouter />,
    };
};

export const fullRouterAndProvider = (fnr: string | undefined, initialEntries: string[] | undefined = undefined) => {
    return () => (
        <Provider erVeileder={fnr !== undefined} fnr={fnr}>
            <AllRoutesInMemory initialEntries={initialEntries} fnr={fnr} />
        </Provider>
    );
};

const AllRoutesInMemory = ({
    fnr,
    initialEntries,
}: {
    fnr: string | undefined;
    initialEntries: string[] | undefined;
}) => {
    const router = createMemoryRouter(dialogRoutes(fnr), {
        initialEntries,
        future: reactRouterFutureFlags,
    });
    return <RouterProvider router={router} />;
};

export const SimpleRouterWithoutProvider = ({
    initialEntries,
    children,
}: {
    children: ReactElement;
    initialEntries: string[] | undefined;
}) => {
    const router = createMemoryRouter(
        [
            {
                id: RouteIds.Root,
                path: '*',
                element: (
                    <div>
                        <Outlet />
                    </div>
                ),
                children: [
                    {
                        id: RouteIds.Dialog,
                        path: ':dialogId',
                        element: children,
                    },
                ],
            },
        ],
        {
            initialEntries,
            future: reactRouterFutureFlags,
        },
    );
    return <RouterProvider router={router} />;
};
