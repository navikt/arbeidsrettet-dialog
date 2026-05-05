import { act, render, waitFor } from '@testing-library/react';
import React from 'react';

import { DialogTrad } from '../view/dialog/DialogTrad';
import DialogListe from '../view/dialogliste/DialogListe';
import DialogOversikt from '../view/dialogliste/DialogOversikt';
import { afterAll, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../mock/handlers';
import { dialoger, gitt } from './mockUtils';
import { SimpleRouterWithoutProvider } from './integrationTestSetup';

const MemoryRouterMedBareDialogTrad = () => {
    return (
        <SimpleRouterWithoutProvider initialEntries={['/2']}>
            <DialogTrad />
        </SimpleRouterWithoutProvider>
    );
};
const MemoryRouterMedBareDialogListe = () => (
    <SimpleRouterWithoutProvider initialEntries={['/2']}>
        <DialogListe />
    </SimpleRouterWithoutProvider>
);
const MemoryRouterMedBareDialogOversikt = () => (
    <SimpleRouterWithoutProvider initialEntries={['/2']}>
        <DialogOversikt />
    </SimpleRouterWithoutProvider>
);

const rootLoaderData = {
    dialoger: Promise.resolve([]),
};

describe('<DialogContainer/>', () => {
    afterAll(() => {
        vi.clearAllMocks();
    });

    test('Bruker uten oppf.perioder og ikke under oppf skjuler store deler av appen', async () => {
        gitt.veileder().som.harIngenDialog().som.harBrukerSomAldriHarVærtUnderOppfolging();
        const { queryByText, getByRole } = render(<MemoryRouterMedBareDialogListe />);
        expect(queryByText('Ny dialog')).toBeNull();
        expect(getByRole('navigation').children.length).toBe(0);
    });
    test('Bruker ikke under oppf. skjuler knapper/checkbox', () => {
        gitt.veileder().som.harDialog().som.harBrukerIkkeLengerErUnderOppfolging();
        const { queryByText, getByRole } = render(<MemoryRouterMedBareDialogListe />);
        expect(queryByText('Ny dialog')).toBeNull();
        expect(getByRole('navigation').children.length).toBeGreaterThan(0);
    });
    test('Bruker under oppf, elementer synes', async () => {
        vi.mock('../routing/loaders', () => ({ useRootLoaderData: () => rootLoaderData }));
        gitt.veileder().som.harDialog().som.harBrukerUnderOppfolging();
        const { getByText } = await act(() => render(<MemoryRouterMedBareDialogOversikt />));
        getByText('Ny dialog');
        getByText(dialoger[0].overskrift);
    });
});

describe('<Dialog/>', () => {
    const worker = setupServer(...handlers);
    beforeAll(() => {
        worker.listen({
            onUnhandledRequest: (request, er) => {
                console.error(request, er);
            },
        });
    });
    afterAll(() => {
        vi.clearAllMocks();
        worker.close();
    });
    afterEach(() => {
        worker.resetHandlers();
    });

    test('Bruker ikke under oppf. skjuler dialogcontroller og viser fortsatt henvendelser', async () => {
        gitt.veileder().som.harDialog().som.harBrukerIkkeLengerErUnderOppfolging();
        const { queryByRole, getByLabelText, queryByLabelText } = render(<MemoryRouterMedBareDialogTrad />);
        expect(queryByRole('form')).toBeNull();
        await waitFor(() => getByLabelText('Meldinger'));
        expect(queryByLabelText('Venter på svar fra Nav')).toBeDisabled();
        expect(queryByLabelText('Venter på svar fra bruker')).toBeDisabled();
    });
    test('Bruker under oppf. viser komponenter i Dialog', async () => {
        gitt.veileder().som.harDialog().som.harBrukerUnderOppfolging();
        const { getByText, getByLabelText } = render(<MemoryRouterMedBareDialogTrad />);
        await waitFor(() => getByLabelText('Ny melding'));
        await waitFor(() => getByLabelText('Meldinger'));
        await waitFor(() => getByText('Venter på svar fra Nav'));
    });
    test('Veileder skal kunne fjerne "Venter på svar fra Nav" på brukere som er under oppf. men reservert i KRR og dialog venter på svar', async () => {
        gitt.veileder().som.harDialogSomVenterPåBruker().som.harBrukerUnderOppfølgingMenReservertIKRR();
        const { queryByRole, getByLabelText, queryByLabelText } = render(<MemoryRouterMedBareDialogTrad />);
        expect(queryByRole('form')).toBeNull();
        await waitFor(() => getByLabelText('Meldinger'));
        expect(queryByLabelText('Venter på svar fra Nav')).toBeDisabled();
        expect(queryByLabelText('Venter på svar fra bruker')).not.toBeDisabled();
    });
    test('Veileder skal kunne endre "Venter på svar fra Bruker" på bruker under oppf. men reservet i KRR og dialog ikke er ferdig behandlet', async () => {
        gitt.veileder().som.harDialogSomIkkeErFerdigBehandlet().som.harBrukerUnderOppfølgingMenReservertIKRR();
        const { queryByRole, getByLabelText, queryByLabelText } = render(<MemoryRouterMedBareDialogTrad />);
        expect(queryByRole('form')).toBeNull();
        await waitFor(() => getByLabelText('Meldinger'));
        expect(queryByLabelText('Venter på svar fra Nav')).not.toBeDisabled();
        expect(queryByLabelText('Venter på svar fra bruker')).toBeDisabled();
    });
    test('Veileder skal ikke kunne endre "Venter på svar fra Bruker" eller "Venter på svar fra Nav" på bruker under oppf. reservet i KRR hvis ferdigBehandlet og ikke venter på svar', async () => {
        gitt.veileder().som.harDialog().som.harBrukerUnderOppfølgingMenReservertIKRR();
        const { queryByRole, getByLabelText, queryByLabelText } = render(<MemoryRouterMedBareDialogTrad />);
        expect(queryByRole('form')).toBeNull();
        await waitFor(() => getByLabelText('Meldinger'));
        expect(queryByLabelText('Venter på svar fra Nav')).toBeDisabled();
        expect(queryByLabelText('Venter på svar fra bruker')).toBeDisabled();
    });
    test('Brukere skal ikke kunne se "Venter på svar fra Bruker" eller "Venter på svar fra Nav"', async () => {
        gitt.bruker().som.harDialog().som.harBrukerUnderOppfolging();
        const { queryByRole, getByLabelText, queryByLabelText } = render(<MemoryRouterMedBareDialogTrad />);
        expect(queryByRole('form')).toBeNull();
        await waitFor(() => getByLabelText('Meldinger'));
        expect(queryByLabelText('Venter på svar fra Nav')).not.toBeInTheDocument();
        expect(queryByLabelText('Venter på svar fra bruker')).not.toBeInTheDocument();
    });
});
