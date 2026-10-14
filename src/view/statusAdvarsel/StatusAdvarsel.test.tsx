import { render } from '@testing-library/react';
import React from 'react';
import { expect } from 'vitest';

import { Status } from '../../api/typer';
import { Bruker, PeriodeData } from '../../utils/Typer';
import * as BrukerContext from '../BrukerProvider';
import * as OppfolgingContext from '../OppfolgingProvider';
import { OppfolgingDataGraphqlResponse, OppfolgingDataProviderType } from '../OppfolgingProvider';
import StatusAdvarsel from './StatusAdvarsel';
import { gitt } from '../../test/mockUtils';

const veileder: Bruker = { id: '010101', erVeileder: true, erBruker: false };
const bruker: Bruker = { id: '010101', erVeileder: false, erBruker: true };
const ingenPerioder: PeriodeData[] = [];
const oppfolgingData: OppfolgingDataGraphqlResponse = {
    brukerStatus: {
        krr: {
            kanVarsles: false,
            reservertIKrr: true,
            registrertIKrr: false,
        },
        manuell: {
            erManuell: false,
        },
    },
    oppfolging: {
        erUnderOppfolging: false,
    },
    veilederTilgang: {
        harVeilederLeseTilgangTilBrukersKontorsperre: true,
    },
    oppfolgingsPerioder: ingenPerioder,
};

const useFetchOppfolging: OppfolgingDataProviderType = {
    data: oppfolgingData,
    status: Status.OK,
    hentOppfolging: () => Promise.resolve(undefined),
};

describe('<AlertStripeContainer/>', () => {
    it('Bruker uten oppf.perioder og ikke under oppf. viser en advarsel - veileder.', () => {
        gitt.veileder().som.harIngenDialog().som.harBrukerSomAldriHarVærtUnderOppfolging();

        const { getByText } = render(<StatusAdvarsel />);
        getByText('Denne brukeren har ikke vært og er ikke under arbeidrettet oppfølging.');
    });
    it('Bruker uten oppf.perioder og ikke under oppf. viser en advarsel - bruker. ', () => {
        gitt.bruker().som.harIngenDialog().som.harBrukerSomAldriHarVærtUnderOppfolging();

        const { getByText } = render(<StatusAdvarsel />);
        getByText('Du må være under oppfølging hos Nav for å ha digital dialog med veileder.');
    });
    it('Bruker med oppf.perioder og ikke under oppf. viser en advarsel - bruker. ', () => {
        gitt.bruker().som.harIngenDialog().som.harBrukerIkkeLengerErUnderOppfolging();

        const { getByText, getByRole } = render(<StatusAdvarsel />);
        getByText('Du er ikke lenger registrert hos Nav');
        getByText('Hvis du fortsatt skal få oppfølging fra Nav og ha dialog med veileder må du være registrert.');
        expect(getByRole('link').textContent).toBe('Registrer deg hos Nav');
    });
    it('Bruker med oppf.perioder, ikke under oppf. viser advarsel - veileder', () => {
        gitt.veileder().som.harIngenDialog().som.harBrukerIkkeLengerErUnderOppfolging();

        const wrapper = render(<StatusAdvarsel />);
        expect(wrapper.baseElement.textContent).toBe(
            'Advarsel:  Ikke under arbeidsrettet oppfølgingBruker er ikke under oppfølging og kan ikke sende meldinger',
        );
    });

    it('Bruker registret KRR viser en advarsel - veileder.', () => {
        useFetchOppfolging.data!.oppfolging.erUnderOppfolging = true;

        vi.spyOn(BrukerContext, 'useUserInfoContext').mockImplementation(() => veileder);
        vi.spyOn(OppfolgingContext, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);

        const { getByText } = render(<StatusAdvarsel />);
        getByText('Du kan ikke sende meldinger fordi brukeren har reservert seg mot digital kommunikasjon KRR.');
    });
    it('Bruker registret KRR viser en advarsel - bruker. ', () => {
        gitt.bruker().som.harIngenDialog().som.harBrukerUnderOppfølgingMenReservertIKRR();

        const { getByText, getByRole } = render(<StatusAdvarsel />);
        getByText(
            'Du kan ikke sende meldinger i den digitale dialogen fordi du har reservert deg mot digital kommunikasjon i kontakt og reservasjonsregisteret (KRR).',
        );
        expect(getByRole('link').textContent).toBe('Gå til norge.no for å fjerne reservasjonen.');
    });

    // test('Bruker kan ikke varsles viser en advarsel - bruker. ', () => {
    //     useFetchOppfolging.data.underOppfolging = true;
    //     useFetchOppfolging.data.reservasjonKRR = false;
    //
    //     jest.spyOn(AppContext, 'useUserInfoContext').mockImplementation(() => bruker);
    //     jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);
    //
    //     const wrapper = render(<AlertStripeContainer />);
    //     expect(wrapper.matchesElement(<KanIkkeVarsles erVeileder={false} />)).toBeTruthy();
    // });
    // test('Bruker kan ikke varsles viser en advarsel - veileder', () => {
    //     useFetchOppfolging.data.underOppfolging = true;
    //     useFetchOppfolging.data.reservasjonKRR = false;
    //
    //     jest.spyOn(AppContext, 'useUserInfoContext').mockImplementation(() => veileder);
    //     jest.spyOn(AppContext, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);
    //
    //     const wrapper = render(<AlertStripeContainer />);
    //     expect(wrapper.matchesElement(<KanIkkeVarsles erVeileder={true} />)).toBeTruthy();
    // });

    it('ingen varsler for gyldig status - veileder', () => {
        useFetchOppfolging.data!.oppfolging.erUnderOppfolging = true;
        useFetchOppfolging.data!.brukerStatus.krr.reservertIKrr = false;
        useFetchOppfolging.data!.brukerStatus.krr.kanVarsles = true;
        useFetchOppfolging.data!.brukerStatus.krr.registrertIKrr = true;

        vi.spyOn(BrukerContext, 'useUserInfoContext').mockImplementation(() => veileder);
        vi.spyOn(OppfolgingContext, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);

        const wrapper = render(<StatusAdvarsel />);
        expect(wrapper.baseElement.textContent).toBeFalsy();
    });

    it('ingen varsler for gyldig status - bruker. ', () => {
        useFetchOppfolging.data!.oppfolging.erUnderOppfolging = true;
        useFetchOppfolging.data!.brukerStatus.krr.reservertIKrr = false;
        useFetchOppfolging.data!.brukerStatus.krr.kanVarsles = true;
        useFetchOppfolging.data!.brukerStatus.krr.registrertIKrr = true;

        vi.spyOn(BrukerContext, 'useUserInfoContext').mockImplementation(() => bruker);
        vi.spyOn(OppfolgingContext, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);

        const wrapper = render(<StatusAdvarsel />);
        expect(wrapper.baseElement.textContent).toBeFalsy();
    });
});
