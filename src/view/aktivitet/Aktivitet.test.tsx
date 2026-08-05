import { beforeAll, describe, expect } from 'vitest';
import { gitt } from '../../test/mockUtils';
import {
    behandlingAktivitet,
    ijobbAktivitet,
    moteAktivitet,
    samtalereferatAktivitet,
    stilingAktivitet,
    stillingFraNav,
} from '../../mock/Aktivitet';
import { SimpleRouterWithoutProvider } from '../../test/integrationTestSetup';
import React from 'react';
import { DialogHeader } from '../dialog/DialogHeader';
import { DialogTrad } from '../dialog/DialogTrad';
import { Aktivitetskort } from './Aktivitetskort';
import { act, render } from '@testing-library/react';
import { getKanalTekst } from './MoteAktivitet';
import { formaterDate } from '../../utils/Date';

const MemoryRouterMedBareDialogTråd = () => (
    <SimpleRouterWithoutProvider initialEntries={['/2']}>
        <>
            <DialogHeader />
            <div className="flex min-h-0 flex-1">
                <DialogTrad />
                <Aktivitetskort />
            </div>
        </>
    </SimpleRouterWithoutProvider>
);
const rootLoaderData = {
    dialoger: Promise.resolve([]),
    aktiviteter: Promise.resolve([]),
};

vi.mock('../../routing/loaders', () => ({ useRootLoaderData: () => rootLoaderData }));

describe('aktivteter', () => {
    it('skal vise behandling', async () => {
        gitt.bruker().som.harDialogMedAktivitet(behandlingAktivitet);
        const { getAllByText } = await act(() => render(<MemoryRouterMedBareDialogTråd />));
        expect(getAllByText('Avtale hos kiropraktor')).toHaveLength(2);
        expect(getAllByText('doktor')).toHaveLength(2);
    });

    it('skal vise ijobbAktivitet', async () => {
        gitt.bruker().som.harDialogMedAktivitet(ijobbAktivitet);
        const { getAllByText } = await act(() => render(<MemoryRouterMedBareDialogTråd />));
        getAllByText('Gode arbeidsforhold');
        getAllByText('DELTID');
        getAllByText('arbeidstid midt på dagen');
    });

    it('skal vise møteaktivitet', async () => {
        gitt.bruker().som.harDialogMedAktivitet(moteAktivitet);
        const { getAllByText } = await act(() => render(<MemoryRouterMedBareDialogTråd />));
        getAllByText(moteAktivitet.beskrivelse!!);
        getAllByText(moteAktivitet.tittel!!);
    });

    it('skal vise samtalereferatAktivitet', async () => {
        gitt.bruker().som.harDialogMedAktivitet(samtalereferatAktivitet);
        const { getAllByText } = await act(() => render(<MemoryRouterMedBareDialogTråd />));
        getAllByText(getKanalTekst(samtalereferatAktivitet.kanal!!));
        getAllByText('Vi ble enige om at det skal søkes'); // Tekst er splittet opp
        getAllByText('minst 5 stillinger i uken den første perioden');
        getAllByText(formaterDate(samtalereferatAktivitet.fraDato));
    });

    it('skal vise stilling fra nav aktivitet', async () => {
        gitt.bruker().som.harDialogMedAktivitet(stillingFraNav);
        const { getAllByText } = await act(() => render(<MemoryRouterMedBareDialogTråd />));
        getAllByText(stillingFraNav.stillingFraNavData!!.arbeidsgiver!!);
        getAllByText(stillingFraNav.stillingFraNavData!!.arbeidssted!!);
        getAllByText(formaterDate(stillingFraNav.stillingFraNavData!!.svarfrist));
        getAllByText('Venter på å bli kontaktet');
    });
});
