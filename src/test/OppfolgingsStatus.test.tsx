import { createMemoryRouter, RouterProvider } from 'react-router';
import { reactRouterFutureFlags, RouteIds } from '../routing/routes';
import AppBody from '../view/AppBody';
import { describe, expect } from 'vitest';
import React from 'react';
import { gitt } from './mockUtils';
import { act, render } from '@testing-library/react';
import { fetchData } from '../utils/Fetch';
import { OppfolgingsApi } from '../api/UseApiBasePath';

const singleComponentRouter = (initialEntries: string[] | undefined = undefined) =>
    createMemoryRouter(
        [
            {
                id: RouteIds.Root,
                path: '*',
                element: <AppBody />,
            },
        ],
        {
            initialEntries,
            future: reactRouterFutureFlags,
        },
    );
const MemoryRouterMedBareDialogOversikt = () => (
    <RouterProvider future={{ v7_startTransition: true }} router={singleComponentRouter(['/'])} />
);

const rootLoaderData = {
    dialoger: Promise.resolve([]),
};

describe('Statusadvarsler', () => {
    describe('Oppfølgingsadvarsler', () => {
        describe('Aldri vært under oppfølging', () => {
            it('veileder ser advarsel når bruker ikke er under oppfølging', async () => {
                gitt.veileder().som.harIngenDialog().som.harBrukerSomAldriHarVærtUnderOppfolging();
                const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
                getByText('Denne brukeren har ikke vært og er ikke under arbeidrettet oppfølging.');
            });

            it('bruker ser advarsel når bruker ikke er under oppfølging', async () => {
                gitt.bruker().som.harIngenDialog().som.harBrukerSomAldriHarVærtUnderOppfolging();
                vi.mock('../routing/loaders', () => ({ useRootLoaderData: () => rootLoaderData }));
                const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
                getByText('Du må være registrert hos Nav for å ha digital dialog med veileder.');
            });
        });

        describe('Ikke lenger under oppfølging', () => {
            it('veileder ser advarsel når bruker ikke er under oppfølging', async () => {
                gitt.veileder().som.harIngenDialog().som.harBrukerIkkeLengerErUnderOppfolging();
                const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
                getByText('Bruker er ikke under oppfølging og kan ikke sende meldinger');
            });

            it('bruker ser advarsel når bruker ikke er under oppfølging', async () => {
                gitt.bruker().som.harIngenDialog().som.harBrukerIkkeLengerErUnderOppfolging();
                vi.mock('../routing/loaders', () => ({ useRootLoaderData: () => rootLoaderData }));
                const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
                getByText('Du er ikke lenger registrert hos Nav');
                getByText(
                    'Hvis du fortsatt skal få oppfølging fra Nav og ha dialog med veileder må du være registrert.',
                );
            });
        });
    });

    describe('KRR advarsler', () => {
        it('veileder ser advarsel når bruker er under oppf. men reservert i KRR', async () => {
            gitt.veileder().som.harIngenDialog().som.harBrukerUnderOppfølgingMenReservertIKRR();
            const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
            getByText('Du kan ikke sende meldinger fordi brukeren har reservert seg mot digital kommunikasjon KRR.');
        });

        it('bruker ser advarsel når bruker er under oppf. men reservert i KRR', async () => {
            gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenReservertIKRR();
            const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
            getByText(
                'Du kan ikke sende meldinger i den digitale dialogen fordi du har reservert deg mot digital kommunikasjon i kontakt og reservasjonsregisteret (KRR).',
            );
        });
    });

    describe('Manuell advarsler', () => {
        it('veileder ser advarsel når bruker er under oppf. men manuell', async () => {
            gitt.veileder().som.harIngenDialog().som.harBrukerUnderOppfølgingMenManuell();
            const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
            getByText(
                'Du kan ikke sende meldinger i dialogen fordi kontaktinformasjonen til brukeren er utdatert i KRR.',
            );
        });

        it('bruker ser advarsel når bruker er under oppf. men manuell', async () => {
            gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenManuell();
            const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
            getByText('Du har ikke digital oppfølging fra Nav. Du kan derfor ikke ha digital dialog med veileder');
        });

        it('bruker under oppf. men manuell kan endre til digital oppfølging', async () => {
            vi.mock('../utils/Fetch', () => ({
                fetchData: vi.fn(() => new Promise((resolve) => resolve(undefined))),
            }));
            gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenManuell();
            const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
            const button = getByText('Endre til digital oppfølging');
            button.click();
            expect(fetchData).toHaveBeenCalledWith(OppfolgingsApi.settDigigtal, { method: 'POST' });
        });
    });

    describe('Kan ikke varsles', () => {
        it('veileder ser advarsel når bruker er under oppf. men ikke kan varsler (krr-attributt)', async () => {
            gitt.veileder().som.harIngenDialog().som.harBrukerUnderOppfølgingMenKanIkkeVarsles();
            const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
            getByText(
                'Du kan ikke sende meldinger i dialogen fordi brukeren ikke har registrert e-post eller telefonnummeret sitt i KRR.',
            );
        });

        it('bruker ser advarsel når bruker er under oppf. men ikke kan varsles (krr-attributt)', async () => {
            gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenKanIkkeVarsles();
            const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
            getByText(
                'Du kan ikke sende meldinger i dialogen fordi du ikke har registrert e-post eller telefonnummeret ditt i kontakt og reservasjonsregisteret (KRR).',
            );
        });
    });
});
