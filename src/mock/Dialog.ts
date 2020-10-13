import { DialogData, HenvendelseData, KladdData, NyDialogMeldingData } from '../utils/Typer';
import { rndId } from './Utils';
import { JSONArray, JSONObject, ResponseUtils } from 'yet-another-fetch-mock';
import bruker from './Bruker';
import { erEksternBruker, harIngenDialoger } from './demo/sessionstorage';

const dialoger: DialogData[] & JSONArray = [
    {
        id: '10',
        overskrift: 'Systemutvikler',
        sisteTekst: 'De ringte meg i går. Skal på intervju neste uke :)',
        sisteDato: '2017-01-28T12:48:56.097+01:00',
        opprettetDato: '2018-02-27T12:48:56.081+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: false,
        ferdigBehandlet: false,
        lestAvBrukerTidspunkt: '2018-02-28T12:48:56.081+01:00',
        erLestAvBruker: false,
        aktivitetId: 'STILLING1',
        henvendelser: [
            {
                id: '1',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: 'Z123456',
                sendt: '2018-02-27T12:47:56.097+01:00',
                lest: true,
                viktig: false,
                tekst: 'Hei, det virker som denne stillingen kunne passet for meg. Hva tenker du?'
            },
            {
                id: '2',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: 'Z123456',
                sendt: '2018-02-27T12:48:56.097+01:00',
                lest: true,
                viktig: false,
                tekst: 'Hei, det virker som denne stillingen kunne passet for meg. Hva tenker du?'
            },
            {
                id: '3',
                dialogId: '1',
                avsender: 'VEILEDER',
                avsenderId: '0102030405',
                sendt: '2018-02-28T12:48:55.097+01:00',
                lest: true,
                viktig: false,
                tekst:
                    'Ja, jeg vil så absolutt tro at du er kvalifisert til denne! Send dem en søknad og fortell meg' +
                    'om du får noe respons!'
            },
            {
                id: '4',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-03-28T12:48:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei! Jeg har utforsket denne stillingen som kunderådgiver og fant ut at den passer meg godt. ' +
                    'Jeg tror det passer fordi jeg er god med mennesker og sånn og bla di bla bla bla. Har sendt søknad ' +
                    'men har ikke hørt noe fra dem på to uker. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. ' +
                    'Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis. Usikker på ' +
                    'om jeg burde ringe eller ikke - hva tenker du?'
            },
            {
                id: '4a',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-03-28T12:48:57.097+01:00',
                lest: false,
                viktig: false,
                tekst: 'De ringte meg i går!. Skal på intervju neste uke :)'
            },
            {
                id: '4b',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-03-28T12:48:58.097+01:00',
                lest: false,
                viktig: false,
                tekst: 'De ringte meg i går!!. Skal på intervju neste uke :)'
            },
            {
                id: '4c',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-03-28T12:48:59.097+01:00',
                lest: false,
                viktig: false,
                tekst: 'De ringte meg i går!!!. Skal på intervju neste uke :)'
            },
            {
                id: '4d',
                dialogId: '1',
                avsender: 'BRUKER',
                avsenderId: '0102030405',
                sendt: '2018-03-28T12:49:01.097+01:00',
                lest: false,
                viktig: false,
                tekst: 'De ringte meg i går!!!!. Skal på intervju neste uke :)'
            }
        ],
        egenskaper: []
    },
    {
        id: '2',
        overskrift: 'Du har fått et varsel fra NAV',
        sisteTekst:
            'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.',
        sisteDato: '2018-02-01T11:52:20.615+01:00',
        opprettetDato: '2018-02-01T11:52:20.535+01:00',
        historisk: false,
        lest: true,
        venterPaSvar: false,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: '2018-02-02T11:50:20.615+01:00',
        erLestAvBruker: true,
        aktivitetId: null,
        henvendelser: [
            {
                id: '3',
                dialogId: '2',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-01T11:52:20.615+01:00',
                lest: true,
                viktig: true,
                tekst:
                    'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.'
            }
        ],
        egenskaper: ['ESKALERINGSVARSEL']
    },
    {
        id: '4',
        overskrift: 'Automatiske dialoger',
        sisteTekst:
            'Hei!\n' +
            'Du er registrert som arbeidssøker og NAV trenger å bli kjent med ditt behov for hjelp fra oss, slik at vi kan gi deg riktig veiledning.\n' +
            'Hva mener du? Klik her og vurder hva du selv tenker https://behovsvurdering.nav.no\n',
        sisteDato: '2018-01-28T12:48:56.097+01:00',
        opprettetDato: '2018-02-27T12:48:56.081+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: false,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: null,
        henvendelser: [
            {
                id: '4',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: 'Z999999',
                sendt: '2018-02-27T12:48:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei!\n' +
                    'Du er registrert som arbeidssøker og NAV trenger å bli kjent med ditt behov for hjelp fra oss, slik at vi kan gi deg riktig veiledning.\n' +
                    'Hva mener du? Klik her og vurder hva du selv tenker https://behovsvurdering.nav.no\n'
            },
            {
                id: '5',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: 'Z999999',
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei!\n' +
                    'Du har svart at du har utfordringer som hindrer deg i å søke eller være i jobb. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet under. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n'
            },
            {
                id: '6',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: 'Z999999',
                sendt: '2018-02-28T12:48:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei!\n' +
                    'Du har svart at du trenger mer veiledning nå som retten til sykepenger nærmer seg slutten. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet under. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n'
            },
            {
                id: '7',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: 'Z999999',
                sendt: '2018-02-28T12:49:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei!\n' +
                    'Du har svart at du trenger mer veiledning nå som retten til sykepenger nærmer seg slutten. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet under. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n'
            },
            {
                id: '8',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: 'Z999999',
                sendt: '2018-02-28T12:50:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei!\n' +
                    'Du har svart at du trenger mer veiledning nå som retten til sykepenger nærmer seg slutten. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet under. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n'
            },
            {
                id: '9',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: 'Z999999',
                sendt: '2018-02-28T12:51:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei!\n' +
                    'Du har svart at du trenger mer veiledning nå som retten til sykepenger nærmer seg slutten. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet under. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n'
            },
            {
                id: '10',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: 'Z999999',
                sendt: '2018-02-28T12:51:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei!\n' +
                    'Du har svart at du trenger mer veiledning nå som retten til sykepenger nærmer seg slutten. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet under. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n'
            },
            {
                id: '11',
                dialogId: '4',
                avsender: 'VEILEDER',
                avsenderId: 'Z999999',
                sendt: '2018-02-28T12:52:56.097+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei!\n' +
                    'Du har svart at du trenger mer veiledning nå som retten til sykepenger nærmer seg slutten. Vi vil veilede deg videre og trenger derfor å vite litt mer.\n' +
                    'Du kan velge om du vil fortelle om situasjonen din \n' +
                    '- i et møte med veilederen din på NAV-kontoret\n' +
                    '- i en telefonsamtale\n' +
                    '- her i dialogen\n' +
                    'Skriv svaret ditt i feltet under. Hvis du velger "her i dialogen", kan du fortelle mer allerede nå.\n'
            }
        ],
        egenskaper: []
    },
    {
        id: '5',
        overskrift: 'Gruppeaktivitet',
        sisteTekst: 'Ja, jeg tror det er rimelig. Skal prøve å få kontakt med han som driver greia',
        sisteDato: '2018-02-01T11:52:20.615+01:00',
        opprettetDato: '2018-02-01T11:52:20.535+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: false,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: null,
        henvendelser: [
            {
                id: '3',
                dialogId: '2',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: false,
                tekst: 'Ja, jeg tror det er rimelig. Skal prøve å få kontakt med han som driver greia'
            }
        ],
        egenskaper: []
    },
    {
        id: '6',
        overskrift: 'Samtale om søkekrav',
        sisteTekst: 'Hei. Se referat etter samtalen vår',
        sisteDato: '2018-02-01T11:52:20.615+01:00',
        opprettetDato: '2018-02-01T11:52:20.535+01:00',
        historisk: false,
        lest: true,
        venterPaSvar: false,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'SAMTALEREFERAT1',
        henvendelser: [
            {
                id: '3',
                dialogId: '2',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: false,
                tekst: 'Hei. Se referat etter samtalen vår'
            }
        ],
        egenskaper: []
    },
    {
        id: '7',
        overskrift: 'Kiropraktortime',
        sisteTekst: 'Hei. Jeg var hos kiropraktor i går. Han sa at jeg må komme tilbake om en uke',
        sisteDato: '2018-02-01T11:52:20.615+01:00',
        opprettetDato: '2018-02-01T11:52:20.535+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'ARENATA11',
        henvendelser: [
            {
                id: '3',
                dialogId: '2',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: true,
                tekst: 'Hei. Jeg var hos kiropraktor i går. Han sa at jeg må komme tilbake om en uke'
            }
        ],
        egenskaper: ['PARAGRAF8']
    },
    {
        id: '11',
        overskrift: 'Fiskeoppdrett',
        sisteTekst:
            'Hei. Jeg vil at du skal prøve å søke minst 5 stillinger i uken. Vi møtes igjen om en uke for å prate om hvordan det har gått. ',
        sisteDato: '2018-02-01T11:52:20.615+01:00',
        opprettetDato: '2018-02-01T11:52:20.535+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'SOKEAVTALE2',
        henvendelser: [
            {
                id: '3',
                dialogId: '2',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei. Jeg vil at du skal prøve å søke minst 5 stillinger i uken. Vi møtes igjen om en uke for å prate om hvordan det har gått. '
            }
        ],
        egenskaper: []
    },
    {
        id: '100',
        overskrift: 'Fiskeoppdrett',
        sisteTekst:
            'Hei. Jeg vil at du skal prøve å søke minst 5 stillinger i uken. Vi møtes igjen om en uke for å prate om hvordan det har gått. ',
        sisteDato: '2018-02-01T11:52:20.615+01:00',
        opprettetDato: '2018-02-01T11:52:20.535+01:00',
        historisk: true,
        lest: false,
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'SOKEAVTALE2',
        henvendelser: [
            {
                id: '1000',
                dialogId: '100',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2018-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: false,
                tekst:
                    'Hei. Jeg vil at du skal prøve å søke minst 5 stillinger i uken. Vi møtes igjen om en uke for å prate om hvordan det har gått. '
            }
        ],
        egenskaper: []
    }
];

export function lesDialog(dialogId: string) {
    const dialog: any = dialoger.find((dialog) => dialog.id === dialogId);
    if (dialog) {
        dialog.lest = true;

        if (erEksternBruker()) {
            dialog.lestAvBrukerTidspunkt = new Date();
        }

        return ResponseUtils.jsonPromise(dialog);
    }
    return Promise.resolve({ status: 404 });
}

export function opprettEllerOppdaterDialog(update: NyDialogMeldingData): DialogData & JSONObject {
    const dialogId = !update.dialogId || update.dialogId === '' ? rndId() : `${update.dialogId}`;
    const nyHenvendelse: HenvendelseData = {
        id: rndId(),
        dialogId: dialogId,
        avsender: erEksternBruker() ? 'BRUKER' : 'NAV',
        avsenderId: 'Z123456',
        sendt: new Date().toISOString(),
        lest: true,
        viktig: false,
        tekst: update.tekst
    };

    const eksisterendeDialog = dialoger.find((dialog) => update.dialogId !== undefined && dialog.id === dialogId);

    if (eksisterendeDialog) {
        const oldDialog = eksisterendeDialog;
        oldDialog.sisteTekst = update.tekst;
        oldDialog.sisteDato = nyHenvendelse.sendt;
        oldDialog.henvendelser.push(nyHenvendelse);

        if (!bruker().erVeileder) {
            oldDialog.ferdigBehandlet = false;
            oldDialog.venterPaSvar = false;
        }

        return oldDialog as DialogData & JSONObject;
    } else {
        const nyDialog: DialogData = {
            id: nyHenvendelse.dialogId,
            overskrift:
                update.overskrift === undefined || update.overskrift === null ? rndId().toString() : update.overskrift,
            sisteTekst: update.tekst,
            sisteDato: new Date().toISOString(),
            opprettetDato: new Date().toISOString(),
            historisk: false,
            lest: true,
            venterPaSvar: false,
            ferdigBehandlet: bruker().erVeileder,
            lestAvBrukerTidspunkt: null,
            erLestAvBruker: false,
            aktivitetId: update.aktivitetId || null,
            henvendelser: [nyHenvendelse],
            egenskaper: []
        };
        dialoger.push(nyDialog);
        return nyDialog as DialogData & JSONObject;
    }
}

export function setVenterPaSvar(dialogId: string, venterPaSvar: boolean) {
    const dialog = dialoger.find((dialog) => dialog.id === dialogId);
    if (dialog) {
        dialog.venterPaSvar = venterPaSvar;
    }
    return dialog as DialogData & JSONObject;
}

export function setFerdigBehandlet(dialogId: string, ferdigBehandlet: boolean) {
    const dialog = dialoger.find((dialog) => dialog.id === dialogId);
    if (dialog) {
        dialog.ferdigBehandlet = ferdigBehandlet;
    }
    return dialog as DialogData & JSONObject;
}

let counter = 0;

export default () => {
    // mock more dialoger inncomming while users are using the system
    if (counter === 1) {
        const nyDialog = {
            id: '6666',
            overskrift: 'Sender denne mens du ser på :)',
            sisteTekst: 'Halla, hvordan ser dette ut?',
            sisteDato: new Date().toISOString(),
            opprettetDato: new Date().toISOString(),
            historisk: false,
            lest: false,
            venterPaSvar: false,
            ferdigBehandlet: true,
            lestAvBrukerTidspunkt: null,
            erLestAvBruker: false,
            aktivitetId: null,
            henvendelser: [
                {
                    id: '3666',
                    dialogId: '6666',
                    avsender: 'VEILEDER',
                    avsenderId: 'Z123456',
                    sendt: new Date().toISOString(),
                    lest: false,
                    tekst: 'Halla, hvordan ser dette ut?'
                }
            ],
            egenskaper: []
        };
        dialoger.push(nyDialog);
        const nyHenvendelse: HenvendelseData = {
            id: rndId(),
            dialogId: '2',
            avsender: 'NAV',
            avsenderId: 'Z123456',
            sendt: new Date().toISOString(),
            lest: false,
            viktig: false,
            tekst: 'Hei, hvordan går det?'
        };
        const d = dialoger.find((d) => d.id === '2');
        d!.henvendelser.push(nyHenvendelse);
        d!.lest = false;
    }
    counter += 1;
    return harIngenDialoger() ? [] : [...dialoger];
};

export const kladder: KladdData[] & JSONArray = [
    {
        dialogId: null,
        aktivitetId: 'SOKEAVTALE1',
        overskrift: 'Begynte på en tekst',
        tekst: 'Her er mer tekst'
    },
    {
        dialogId: '6',
        aktivitetId: 'SAMTALEREFERAT1',
        overskrift: null,
        tekst: 'Jeg lurer på masse rart'
    }
];

export function oppdaterKladd(data: KladdData) {
    return null;
}
