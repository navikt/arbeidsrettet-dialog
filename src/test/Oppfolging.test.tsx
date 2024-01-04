import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { Status } from '../api/typer';
import { Bruker, OppfolgingData, PeriodeData } from '../utils/Typer';
import * as BrukerProvider from '../view/BrukerProvider';
import { DialogTrad } from '../view/dialog/DialogTrad';
import DialogListe from '../view/dialogliste/DialogListe';
import DialogOversikt from '../view/dialogliste/DialogOversikt';
import * as DialogProvider from '../view/DialogProvider';
import * as dialogStoreHooks from '../view/dialogProvider/storeHooks';
import { DialogDataProviderType } from '../view/DialogProvider';
import * as OppfolgingProvider from '../view/OppfolgingProvider';
import { OppfolgingDataProviderType } from '../view/OppfolgingProvider';
import * as AppContext from '../view/Provider';

const userInfo: Bruker = { id: '010101', erVeileder: true, erBruker: false };
const oppfPerioder: PeriodeData[] = [];
const oppfolgingData: OppfolgingData = {
    fnr: 'null',
    veilederId: '101010',
    reservasjonKRR: false,
    manuell: false,
    underOppfolging: true, // eller false
    underKvp: false,
    oppfolgingUtgang: null,
    gjeldendeEskaleringsvarsel: null,
    kanStarteOppfolging: false,
    avslutningStatus: null,
    oppfolgingsPerioder: oppfPerioder,
    harSkriveTilgang: true,
    kanReaktiveres: false,
    inaktiveringsdato: '2018-08-31T10:46:10.971+01:00',
    aktorId: 'null',
    erSykmeldtMedArbeidsgiver: false,
    formidlingsgruppe: null,
    kanVarsles: true,
    servicegruppe: null
};

const useFetchOppfolging: OppfolgingDataProviderType = {
    data: oppfolgingData,
    status: Status.OK,
    hentOppfolging: () => Promise.resolve(undefined)
};

const dialoger = [
    {
        id: '1',
        aktivitetId: '1',
        overskrift: 'Memes',
        sisteTekst: 'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
        sisteDato: '2018-01-28T12:48:56.097+01:00',
        opprettetDato: '2018-02-27T12:48:56.081+01:00',
        historisk: false,
        lest: true,
        venterPaSvar: false,
        ferdigBehandlet: false,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        henvendelser: [
            {
                id: '1',
                dialogId: '1',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-27T12:48:56.097+01:00',
                lest: true,
                tekst: 'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
                viktig: false
            },
            {
                id: '2',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: true,
                tekst: 'Hei. Leter enda på sjøen :)',
                viktig: false
            }
        ],
        egenskaper: []
    }
];
const useDialogContext: DialogDataProviderType = {
    status: 3,
    nyDialog: (args) => Promise.resolve({} as any),
    nyMelding: ({ dialog }) => Promise.resolve(dialog)
};

describe('<DialogContainer/>', () => {
    test('Bruker uten oppf.perioder og ikke under oppf skjuler store deler av appen', () => {
        useFetchOppfolging.data!.underOppfolging = false;
        useFetchOppfolging.data!.oppfolgingsPerioder = [];
        vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);
        const { queryByText, getByRole } = render(
            <MemoryRouter>
                <DialogListe />
            </MemoryRouter>
        );
        expect(queryByText('Ny dialog')).toBeNull();
        expect(getByRole('navigation').children.length).toBe(0);
    });
    test('Bruker ikke under oppf. skjuler knapper/checkbox', () => {
        useFetchOppfolging.data!.underOppfolging = false;
        useFetchOppfolging.data!.oppfolgingsPerioder = [
            {
                aktorId: '1234567988888',
                veileder: false,
                startDato: '2017-01-30T10:46:10.971+01:00',
                sluttDato: '2017-12-31T10:46:10.971+01:00',
                begrunnelse: null,
                kvpPerioder: []
            }
        ];
        vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);
        vi.spyOn(dialogStoreHooks, 'useDialoger').mockImplementation(() => dialoger);
        const { queryByText, getByRole } = render(
            <MemoryRouter>
                <DialogListe />
            </MemoryRouter>
        );
        expect(queryByText('Ny dialog')).toBeNull();
        expect(getByRole('navigation').children.length).toBeGreaterThan(0);
    });
    test('Bruker under oppf, elementer synes', () => {
        useFetchOppfolging.data!.underOppfolging = true;
        useFetchOppfolging.data!.oppfolgingsPerioder = [
            {
                aktorId: '1234567988888',
                veileder: false,
                startDato: '2017-01-30T10:46:10.971+01:00',
                sluttDato: '2017-12-31T10:46:10.971+01:00',
                begrunnelse: null,
                kvpPerioder: []
            }
        ];
        vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);
        vi.spyOn(AppContext, 'useHarNivaa4Context').mockImplementation(() => ({
            harNivaa4: true,
            hasError: false,
            isPending: false
        }));
        vi.spyOn(dialogStoreHooks, 'useDialoger').mockImplementation(() => dialoger);
        const { getByText } = render(
            <MemoryRouter>
                <DialogOversikt />
            </MemoryRouter>
        );
        getByText('Ny dialog');
        getByText(dialoger[0].overskrift);
    });
});

describe('<Dialog/>', () => {
    test('Bruker ikke under oppf. skjuler dialogcontroller og viser fortsatt henvendelser', () => {
        useFetchOppfolging.data!.underOppfolging = false;
        useFetchOppfolging.data!.oppfolgingsPerioder = [
            {
                aktorId: '1234567988888',
                veileder: false,
                startDato: '2017-01-30T10:46:10.971+01:00',
                sluttDato: '2017-12-31T10:46:10.971+01:00',
                begrunnelse: null,
                kvpPerioder: []
            }
        ];
        vi.spyOn(DialogProvider, 'useDialogContext').mockImplementation(() => useDialogContext);
        vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);
        vi.spyOn(dialogStoreHooks, 'useDialoger').mockImplementation(() => dialoger);
        Element.prototype.scrollIntoView = () => {};
        const { queryByLabelText, queryByText, queryByRole } = render(
            <MemoryRouter initialEntries={['/1']}>
                <Routes>
                    <Route path={'/:dialogId'} element={<DialogTrad />} />
                </Routes>
            </MemoryRouter>
        );

        expect(queryByRole('form')).toBeNull();
        expect(queryByLabelText('Meldinger')).toBeTruthy();
        expect(queryByText('Venter på svar fra NAV')).toBeNull();
    });
    test('Bruker under oppf. viser komponenter i Dialog', () => {
        useFetchOppfolging.data!.underOppfolging = true;
        useFetchOppfolging.data!.oppfolgingsPerioder = [
            {
                aktorId: '1234567988888',
                veileder: false,
                startDato: '2017-01-30T10:46:10.971+01:00',
                sluttDato: '2017-12-31T10:46:10.971+01:00',
                begrunnelse: null,
                kvpPerioder: []
            }
        ];
        vi.spyOn(DialogProvider, 'useDialogContext').mockImplementation(() => useDialogContext);
        vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => useFetchOppfolging);
        vi.spyOn(BrukerProvider, 'useUserInfoContext').mockImplementation(() => userInfo);
        vi.spyOn(dialogStoreHooks, 'useDialoger').mockImplementation(() => dialoger);
        vi.spyOn(AppContext, 'useHarNivaa4Context').mockImplementation(() => ({
            harNivaa4: true,
            hasError: false,
            isPending: false
        }));
        Element.prototype.scrollIntoView = () => {};
        const { getByRole, getByText, getByLabelText } = render(
            <MemoryRouter initialEntries={['/1']}>
                <Routes>
                    <Route path={'/:dialogId'} element={<DialogTrad />} />
                </Routes>
            </MemoryRouter>
        );
        getByLabelText('Ny melding');
        getByLabelText('Meldinger');
        getByText('Venter på svar fra NAV');
    });
});
