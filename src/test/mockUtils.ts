import * as OppfolgingProvider from '../view/OppfolgingProvider';
import * as BrukerProvider from '../view/BrukerProvider';
import * as DialogProvider from '../view/DialogProvider';
import { Bruker, DialogData, OppfolgingData, PeriodeData } from '../utils/Typer';
import { Status } from '../api/typer';
import * as Provider from '../view/Provider';
import { Aktivitet } from '../utils/aktivitetTypes';
import * as AktivitetProvider from '../view/AktivitetProvider';
import { AktivitetDataProviderType, useAktivitetContext } from '../view/AktivitetProvider';

const testFnr = '01234567890';
const veilederUserInfo: Bruker = { id: '010101', erVeileder: true, erBruker: false };
const bukerUserInfo: Bruker = { id: testFnr, erVeileder: false, erBruker: true };
const oppfPerioder: PeriodeData[] = [];
const enLukketOppfølgingsPeriode = [
    {
        aktorId: '1234567988888',
        veileder: false,
        startDato: '2017-01-30T10:46:10.971+01:00',
        sluttDato: '2017-12-31T10:46:10.971+01:00',
        begrunnelse: null,
        kvpPerioder: [],
        uuid: '1',
    },
];
const oppfolgingData: OppfolgingData = {
    reservasjonKRR: false,
    manuell: false,
    underOppfolging: true, // eller false
    underKvp: false,
    gjeldendeEskaleringsvarsel: null,
    oppfolgingsPerioder: oppfPerioder,
    harSkriveTilgang: true,
    kanVarsles: true,
    registrertKRR: false,
};

const baseOppfolgingsData = {
    data: oppfolgingData,
    status: Status.OK,
    hentOppfolging: () => Promise.resolve(undefined),
};
const aldriVærtUnderOppfølgingData = {
    ...baseOppfolgingsData,
    data: {
        ...baseOppfolgingsData.data,
        underOppfolging: false,
        oppfolgingsPerioder: [],
    },
};
const ikkeLengerUnderOppfølgingData = {
    ...baseOppfolgingsData,
    data: {
        ...baseOppfolgingsData.data,
        underOppfolging: false,
        oppfolgingsPerioder: enLukketOppfølgingsPeriode,
    },
};
const underOppfølgingsData = {
    ...baseOppfolgingsData,
    data: {
        ...baseOppfolgingsData.data,
        underOppfolging: true,
        oppfolgingsPerioder: enLukketOppfølgingsPeriode,
    },
};
const underOppfølgingMenReservertIKRRData = {
    ...underOppfølgingsData,
    data: {
        ...underOppfølgingsData.data,
        reservasjonKRR: true,
    },
};
const underOppfølgingMenManuell = {
    ...underOppfølgingsData,
    data: {
        ...underOppfølgingsData.data,
        manuell: true,
    },
};
const underOppfølgingMenKanIkkeVarsles = {
    ...underOppfølgingsData,
    data: {
        ...underOppfølgingsData.data,
        kanVarsles: false,
    },
};

const ingenDialoger = [] as DialogData[];
export const dialoger = [
    {
        id: '2',
        aktivitetId: '1',
        overskrift: 'Memes',
        sisteTekst: 'Hei. Hva er status her? Har du finnet Kaptain Sabeltann?',
        sisteDato: '2018-01-28T12:48:56.097+01:00',
        opprettetDato: '2018-02-27T12:48:56.081+01:00',
        historisk: false,
        lest: true,
        venterPaSvar: false,
        ferdigBehandlet: true,
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
                viktig: false,
            },
            {
                id: '2',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: true,
                tekst: 'Hei. Leter enda på sjøen :)',
                viktig: false,
            },
        ],
        egenskaper: [],
    },
];

const harBrukerUnderOppfolging = () => {
    vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => underOppfølgingsData);
    return { som: gitt };
};
const harBrukerSomAldriHarVærtUnderOppfolging = () => {
    vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => aldriVærtUnderOppfølgingData);
    return { som: gitt };
};
const harBrukerIkkeLengerErUnderOppfolging = () => {
    vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => ikkeLengerUnderOppfølgingData);
    return { som: gitt };
};
const harBrukerUnderOppfølgingMenReservertIKRR = () => {
    vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => underOppfølgingMenReservertIKRRData);
    return { som: gitt };
};
const harBrukerUnderOppfølgingMenManuell = () => {
    vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => underOppfølgingMenManuell);
    return { som: gitt };
};
const harBrukerUnderOppfølgingMenKanIkkeVarsles = () => {
    vi.spyOn(OppfolgingProvider, 'useOppfolgingContext').mockImplementation(() => underOppfølgingMenKanIkkeVarsles);
    return { som: gitt };
};
const veileder = () => {
    vi.spyOn(BrukerProvider, 'useUserInfoContext').mockImplementation(() => veilederUserInfo);
    vi.spyOn(Provider, 'useFnrContext').mockImplementation(() => testFnr);
    vi.spyOn(Provider, 'useErVeileder').mockImplementation(() => true);
    return { som: dialogerConfig };
};
const bruker = () => {
    vi.spyOn(BrukerProvider, 'useUserInfoContext').mockImplementation(() => bukerUserInfo);
    vi.spyOn(Provider, 'useFnrContext').mockImplementation(() => undefined);
    vi.spyOn(Provider, 'useErVeileder').mockImplementation(() => false);
    return { som: dialogerConfig };
};

const harIngenDialog = () => {
    vi.spyOn(DialogProvider, 'useDialoger').mockImplementation(() => ingenDialoger);
    return { som: oppfolgingConfig };
};
const harDialog = () => {
    vi.spyOn(DialogProvider, 'useDialoger').mockImplementation(() => dialoger);
    return { som: oppfolgingConfig };
};
const harDialogMedAktivitet = (aktivitet: Aktivitet) => {
    const dialogWithAktivitet: DialogData[] = [
        {
            ...dialoger[0],
            aktivitetId: aktivitet.id,
        },
    ];
    const aktivitetProvider: AktivitetDataProviderType = {
        aktiviteterStatus: Status.OK,
        aktiviteter: [aktivitet],
        arenaAktiviteter: [],
        arenaAktiviteterStatus: Status.OK,
    };
    vi.spyOn(AktivitetProvider, 'useAktivitetDataProvider').mockImplementation(() => aktivitetProvider);
    vi.spyOn(AktivitetProvider, 'useAktivitetContext').mockImplementation(() => aktivitetProvider);
    vi.spyOn(DialogProvider, 'useDialoger').mockImplementation(() => dialogWithAktivitet);
    return { som: oppfolgingConfig };
};
const harDialogSomVenterPåBruker = () => {
    const dialogSomVenterPåNAV: DialogData[] = [
        {
            ...dialoger[0],
            venterPaSvar: true,
            historisk: false,
        },
    ];
    vi.spyOn(DialogProvider, 'useDialoger').mockImplementation(() => dialogSomVenterPåNAV);
    return { som: oppfolgingConfig };
};
const harDialogSomIkkeErFerdigBehandlet = () => {
    const dialogSomVenterPåNAV: DialogData[] = [
        {
            ...dialoger[0],
            ferdigBehandlet: false,
            historisk: false,
        },
    ];
    vi.spyOn(DialogProvider, 'useDialoger').mockImplementation(() => dialogSomVenterPåNAV);
    return { som: oppfolgingConfig };
};

const brukerTypeConfig = {
    veileder,
    bruker,
};
const dialogerConfig = {
    harIngenDialog,
    harDialog,
    harDialogMedAktivitet,
    harDialogSomVenterPåBruker,
    harDialogSomIkkeErFerdigBehandlet,
};
const oppfolgingConfig = {
    harBrukerUnderOppfolging,
    harBrukerSomAldriHarVærtUnderOppfolging,
    harBrukerIkkeLengerErUnderOppfolging,
    harBrukerUnderOppfølgingMenReservertIKRR,
    harBrukerUnderOppfølgingMenManuell,
    harBrukerUnderOppfølgingMenKanIkkeVarsles,
};

export const gitt = brukerTypeConfig;
