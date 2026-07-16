import { createMemoryRouter, RouterProvider } from 'react-router';
import { RouteIds } from '../routing/routes';
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
        },
    );
const MemoryRouterMedBareDialogOversikt = () => <RouterProvider router={singleComponentRouter(['/'])} />;

vi.mock('../routing/loaders', () => ({
    useRootLoaderData: () => ({
        dialoger: Promise.resolve([]),
    }),
}));

vi.mock('../utils/Fetch', () => ({
    fetchData: vi.fn(() => Promise.resolve(undefined)),
}));

describe('Statusadvarsler', () => {
    describe('Oppfølgingsadvarsler', () => {
        describe('Aldri vært under oppfølging', () => {
            it('veileder ser advarsel når bruker ikke er under oppfølging', async () => {
                gitt.veileder().som.harIngenDialog().som.harBrukerSomAldriHarVærtUnderOppfolging();
                const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
                await findByText('Denne brukeren har ikke vært og er ikke under arbeidrettet oppfølging.');
            });

            it('bruker ser advarsel når bruker ikke er under oppfølging', async () => {
                gitt.bruker().som.harIngenDialog().som.harBrukerSomAldriHarVærtUnderOppfolging();
                const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
                await findByText('Du må være under oppfølging hos Nav for å ha digital dialog med veileder.');
            });
        });

        describe('Ikke lenger under oppfølging', () => {
            it('veileder ser advarsel når bruker ikke er under oppfølging', async () => {
                gitt.veileder().som.harIngenDialog().som.harBrukerIkkeLengerErUnderOppfolging();
                const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
                await findByText('Bruker er ikke under oppfølging og kan ikke sende meldinger');
            });

            it('bruker ser advarsel når bruker ikke er under oppfølging', async () => {
                gitt.bruker().som.harIngenDialog().som.harBrukerIkkeLengerErUnderOppfolging();
                const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
                await findByText('Du er ikke lenger registrert hos Nav');
                await findByText(
                    'Hvis du fortsatt skal få oppfølging fra Nav og ha dialog med veileder må du være registrert.',
                );
            });
        });
    });

    describe('KRR advarsler', () => {
        it('veileder ser advarsel når bruker er under oppf. men reservert i KRR', async () => {
            gitt.veileder().som.harIngenDialog().som.harBrukerUnderOppfølgingMenReservertIKRR();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText(
                'Du kan ikke sende meldinger fordi brukeren har reservert seg mot digital kommunikasjon KRR.',
            );
        });

        it('bruker ser advarsel når bruker er under oppf. men reservert i KRR', async () => {
            gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenReservertIKRR();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText(
                'Du kan ikke sende meldinger i den digitale dialogen fordi du har reservert deg mot digital kommunikasjon i kontakt og reservasjonsregisteret (KRR).',
            );
        });
    });

    describe('Manuell advarsler', () => {
        it('veileder ser advarsel når bruker er under oppf. men manuell', async () => {
            gitt.veileder().som.harIngenDialog().som.harBrukerUnderOppfølgingMenManuell();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText(
                'Du kan ikke sende meldinger i dialogen fordi kontaktinformasjonen til brukeren er utdatert i KRR.',
            );
        });

        it('bruker ser advarsel når bruker er under oppf. men manuell', async () => {
            gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenManuell();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText(
                'Du har ikke digital oppfølging fra Nav. Du kan derfor ikke ha digital dialog med veileder',
            );
        });

        it('bruker under oppf. men manuell kan endre til digital oppfølging', async () => {
            gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenManuell();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            const button = await findByText('Endre til digital oppfølging');
            button.click();
            expect(fetchData).toHaveBeenCalledWith(OppfolgingsApi.settDigigtal, { method: 'POST' });
        });
    });

    describe('Kan ikke varsles', () => {
        it('veileder ser advarsel når bruker er under oppf. men ikke kan varsler (krr-attributt)', async () => {
            gitt.veileder().som.harIngenDialog().som.harBrukerUnderOppfølgingMenKanIkkeVarsles();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText(
                'Du kan ikke sende meldinger i dialogen fordi brukeren ikke har registrert e-post eller telefonnummeret sitt i KRR.',
            );
        });

        it('bruker ser advarsel når bruker er under oppf. men ikke kan varsles (krr-attributt)', async () => {
            gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenKanIkkeVarsles();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText(
                'Du kan ikke sende meldinger i dialogen fordi du ikke har registrert e-post eller telefonnummeret ditt i kontakt og reservasjonsregisteret (KRR).',
            );
        });
    });
});
