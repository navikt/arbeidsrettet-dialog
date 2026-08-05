import { SimpleRouterWithoutProvider } from './integrationTestSetup';
import DialogOversikt from '../view/dialogliste/DialogOversikt';
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { dialoger, gitt } from './mockUtils';
import { afterAll, beforeAll, describe, expect } from 'vitest';
import NyDialogTrad from '../view/dialog/NyDialogTrad';

const MemoryRouterMedBareDialogOversikt = () => (
    <SimpleRouterWithoutProvider initialEntries={['/2']}>
        <DialogOversikt />
    </SimpleRouterWithoutProvider>
);

const MemoryRouterMedBareDialogTrad = () => (
    <SimpleRouterWithoutProvider initialEntries={['/2']}>
        <NyDialogTrad />
    </SimpleRouterWithoutProvider>
);

const rootLoaderData = {
    dialoger: Promise.resolve([]),
};

vi.mock('../routing/loaders', () => ({ useRootLoaderData: () => rootLoaderData }));

const tittelPåFørsteDialog = dialoger[0].overskrift;

describe('Dialog-liste Etiketter', () => {
    afterAll(() => {
        vi.clearAllMocks();
    });

    describe('For brukere:', () => {
        it('Skal vise venter på svar fra bruker etikett', async () => {
            gitt.bruker().som.harDialogSomVenterPåBruker().som.harBrukerUnderOppfolging();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText('Venter på svar fra deg');
        });
        it('Skal IKKE vise venter på svar fra nav etikett', async () => {
            gitt.bruker().som.harDialogSomIkkeErFerdigBehandlet().som.harBrukerUnderOppfolging();
            const { queryByText, findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText(tittelPåFørsteDialog);
            expect(queryByText('Venter på svar fra Nav')).not.toBeInTheDocument();
        });
        it('Skal IKKE vise venter på svar fra nav etikett på ny dialogTrad', async () => {
            gitt.bruker().som.harDialogSomIkkeErFerdigBehandlet().som.harBrukerUnderOppfolging();
            const { queryByText, findByText } = render(<MemoryRouterMedBareDialogTrad />);
            await findByText('Skriv kort hva dialogen skal handle om');
            expect(queryByText('Venter på svar fra bruker')).not.toBeInTheDocument();
        });
    });

    describe('For veiledere:', () => {
        it('Skal vise venter på svar fra bruker etikett', async () => {
            gitt.bruker().som.harDialogSomVenterPåBruker().som.harBrukerUnderOppfolging();
            const { findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText('Venter på svar fra deg');
        });
        it('Skal IKKE vise venter på svar fra nav etikett', async () => {
            gitt.bruker().som.harDialogSomIkkeErFerdigBehandlet().som.harBrukerUnderOppfolging();
            const { queryByText, findByText } = render(<MemoryRouterMedBareDialogOversikt />);
            await findByText(tittelPåFørsteDialog);
            expect(queryByText('Venter på svar fra Nav')).not.toBeInTheDocument();
        });
        it('Skal vise venter på svar fra bruker etikett på ny dialogTrad', async () => {
            gitt.veileder();
            const { findByText } = render(<MemoryRouterMedBareDialogTrad />);
            await findByText('Venter på svar fra bruker');
        });
    });
});
