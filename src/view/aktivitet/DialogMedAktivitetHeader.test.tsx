import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import { Status } from '../../api/typer';
import { Aktivitet, AktivitetStatus, AktivitetTypes, KanalTypes } from '../../utils/aktivitetTypes';
import * as AktivitetProvider from '../AktivitetProvider';
import { AktivitetDataProviderType } from '../AktivitetProvider';
import { DialogMedAktivitetHeader, getInfoText } from './DialogMedAktivitetHeader';

describe('getInfoText', () => {
    it('skal returnere korrekt tekst for stillingsaktivitet', () => {
        const aktivitet: any = {
            type: AktivitetTypes.STILLING,
            tilDato: '2019-10-24T15:44:21.993+02:00',
            arbeidsgiver: 'Testesen',
        };

        const text = getInfoText(aktivitet);
        expect(text).toEqual('Testesen');
    });

    it('skal returnere korrekt tekst for møteaktivitet', () => {
        const aktivitet: any = {
            type: AktivitetTypes.MOTE,
            fraDato: '2019-10-24T15:44:21.993+02:00',
        };

        const text = getInfoText(aktivitet);
        expect(text).toEqual('24.10.2019 / 15:44');
    });

    it('skal returnere korrekt tekst for søkeavtale', () => {
        const aktivitet: any = {
            type: AktivitetTypes.SOKEAVTALE,
            tilDato: '2019-10-25T15:44:21.993+02:00',
            fraDato: '2019-10-24T15:44:21.993+02:00',
        };

        const text = getInfoText(aktivitet);
        expect(text).toEqual('24.10.2019 - 25.10.2019');
    });

    it('skal returnere korrekt tekst for medisinsk behandling', () => {
        const aktivitet: any = {
            type: AktivitetTypes.BEHANDLING,
            behandlingType: 'Kiropraktor',
        };

        const text = getInfoText(aktivitet);
        expect(text).toEqual('Kiropraktor');
    });

    it('skal returnere korrekt tekst for møteaktivitet', () => {
        const aktivitet: any = {
            type: AktivitetTypes.SAMTALEREFERAT,
            fraDato: '2019-10-24T15:44:21.993+02:00',
        };

        const text = getInfoText(aktivitet);
        expect(text).toEqual('24.10.2019');
    });
});

const aktivitet: Aktivitet = {
    adresse: null,
    ansettelsesforhold: null,
    antallStillingerIUken: null,
    antallStillingerSokes: null,
    arbeidssted: null,
    arbeidstid: null,
    avsluttetKommentar: null,
    avtaleOppfolging: null,
    avtalt: false,
    behandlingOppfolging: null,
    behandlingSted: null,
    behandlingType: null,
    beskrivelse: null,
    effekt: null,
    endretAv: null,
    endretDato: null,
    erReferatPublisert: false,
    etikett: null,
    forberedelser: null,
    fraDato: null,
    hensikt: null,
    historisk: false,
    jobbStatus: null,
    kanal: KanalTypes.INTERNETT,
    kontaktperson: null,
    endretAvType: null,
    lenke: null,
    malid: null,
    oppfolging: null,
    opprettetDato: '',
    referat: null,
    status: AktivitetStatus.AVBRUTT,
    stillingsTittel: null,
    transaksjonsType: null,
    versjon: null,
    tittel: 'Kantinemedarbeider',
    id: '123',
    type: AktivitetTypes.STILLING,
    tilDato: '2019-10-24T15:44:21.993+02:00',
    arbeidsgiver: 'Testesen',
    oppfolgingsperiodeId: '1',
};

const aktivitetRes: AktivitetDataProviderType = {
    aktiviteterStatus: Status.OK,
    arenaAktiviteterStatus: Status.OK,
    aktiviteter: [aktivitet],
    arenaAktiviteter: [],
};

describe('<DialogMedAktivitetHeader />', () => {
    it('skal rendre stillingsaktivitet som i snapshot', () => {
        vi.spyOn(AktivitetProvider, 'useAktivitetContext').mockImplementation(() => aktivitetRes);

        const wrapper = render(
            <MemoryRouter>
                <DialogMedAktivitetHeader />
            </MemoryRouter>,
        );

        expect(wrapper.baseElement).toMatchSnapshot();
    });
});
