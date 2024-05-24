import { DefaultBodyType, HttpResponse, HttpResponseResolver, PathParams, StrictRequest } from 'msw';

import { DialogData, KladdData, MeldingsData, NyDialogMeldingData } from '../utils/Typer';
import bruker from './Bruker';
import { erEksternBruker, harIngenDialoger } from './demo/localstorage';
import { rndId } from './Utils';

const dialoger: DialogData[] = [
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
                tekst: 'Det er viktig at du gjennomfører denne aktiviteten med NAV. Gjør du ikke det, kan det medføre at stønaden du mottar fra NAV bortfaller for en periode eller stanses. Hvis du ikke kan gjennomføre aktiviteten, ber vi deg ta kontakt med veilederen din så snart som mulig.'
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
        lest: true,
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
                viktig: false,
                tekst: 'Hei. Jeg var hos kiropraktor i går. Han sa at jeg må komme tilbake om en uke'
            }
        ],
        egenskaper: []
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
                tekst: 'Hei. Jeg vil at du skal prøve å søke minst 5 stillinger i uken. Vi møtes igjen om en uke for å prate om hvordan det har gått. '
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
                tekst: 'Hei. Jeg vil at du skal prøve å søke minst 5 stillinger i uken. Vi møtes igjen om en uke for å prate om hvordan det har gått. '
            }
        ],
        egenskaper: []
    },
    {
        id: '200',
        overskrift: 'Hei, vi har en stilling som kan passe for deg',
        sisteTekst: 'Hva tror du om denne? Arbeidgiver vil gjerne ta en titt på CV-en din. ',
        sisteDato: '2021-02-01T11:52:20.615+01:00',
        opprettetDato: '2021-02-01T11:52:20.535+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'STILLING_FRA_NAV_1',
        henvendelser: [
            {
                id: '2000',
                dialogId: '200',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2021-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: false,
                tekst: 'Hva tror du om denne? Arbeidgiver vil gjerne ta en titt på CV-en din. '
            }
        ],
        egenskaper: []
    },
    {
        id: '201',
        overskrift: 'Hei, vi har en stilling som kan passe for deg',
        sisteTekst: 'Er det ok at vi sender cv-en din videre?. ',
        sisteDato: '2021-09-01T11:52:20.615+01:00',
        opprettetDato: '2021-09-01T11:52:20.535+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'STILLING_FRA_NAV_2',
        henvendelser: [
            {
                id: '2000',
                dialogId: '200',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2021-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: false,
                tekst: 'Er det ok at vi sender cv-en din videre?. '
            }
        ],
        egenskaper: []
    },
    {
        id: '301',
        overskrift: 'Baker Jonson',
        sisteTekst: 'Er du fornøyd med oppgavene dine?',
        sisteDato: '2021-09-01T11:52:20.615+01:00',
        opprettetDato: '2022-09-01T11:52:20.535+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'EKSTERNAKTIVITET_1',
        henvendelser: [
            {
                id: '3000',
                dialogId: '301',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2021-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: false,
                tekst: 'Er du fornøyd med oppgavene dine?'
            }
        ],
        egenskaper: []
    },
    {
        id: '302',
        overskrift: 'Maler Hansson',
        sisteTekst: 'Er du fornøyd med fargene?',
        sisteDato: '2021-09-01T11:52:20.615+01:00',
        opprettetDato: '2022-09-01T11:52:20.535+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'EKSTERNAKTIVITET_2',
        henvendelser: [
            {
                id: '3001',
                dialogId: '302',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2021-02-01T11:52:20.615+01:00',
                lest: false,
                viktig: false,
                tekst: 'Er du fornøyd med fargene?'
            }
        ],
        egenskaper: []
    },
    {
        id: '303',
        overskrift: 'Avklaring',
        sisteTekst: 'Er du fornøyd med oppfølgingen?',
        sisteDato: '2023-09-01T11:52:20.615+01:00',
        opprettetDato: '2023-09-01T11:52:20.535+01:00',
        historisk: false,
        lest: false,
        venterPaSvar: true,
        ferdigBehandlet: true,
        lestAvBrukerTidspunkt: null,
        erLestAvBruker: false,
        aktivitetId: 'EKSTERNAKTIVITET_4',
        henvendelser: [
            {
                id: '3001',
                dialogId: '302',
                avsender: 'VEILEDER',
                avsenderId: 'Z123456',
                sendt: '2023-02-01T11:52:20.615+01:00',
                lest: true,
                viktig: false,
                tekst: 'Er du fornøyd med oppgfølgingen?'
            },
            {
                id: '3002',
                dialogId: '2',
                avsender: 'BRUKER',
                avsenderId: 'Z123456',
                sendt: '2023-02-01T11:52:20.615+01:00',
                lest: true,
                viktig: false,
                tekst: 'Sånn passe. '
            }
        ],
        egenskaper: []
    }
];

export const lesDialog: HttpResponseResolver = ({ request, params }) => {
    const dialogId = params.dialogId;
    const dialog: any = dialoger.find((dlg) => dlg.id === dialogId);
    if (dialog) {
        dialog.lest = true;
        return HttpResponse.json(dialog);
    }

    return new HttpResponse(null, { status: 404 });
};

export const opprettEllerOppdaterDialog = async (req: StrictRequest<DefaultBodyType>): Promise<DialogData> => {
    const body = (await req.json()) as NyDialogMeldingData;
    const dialogId = !body.dialogId || body.dialogId === '' ? rndId() : `${body.dialogId}`;
    const nyMelding: MeldingsData = {
        id: rndId(),
        dialogId: dialogId,
        avsender: erEksternBruker() ? 'BRUKER' : 'NAV',
        avsenderId: 'Z123456',
        sendt: new Date().toISOString(),
        lest: true,
        viktig: false,
        tekst: body.tekst
    };

    const eksisterendeDialog = dialoger.find((dialog) => body.dialogId !== undefined && dialog.id === dialogId);

    if (eksisterendeDialog) {
        const oldDialog = eksisterendeDialog;
        oldDialog.sisteTekst = body.tekst;
        oldDialog.sisteDato = nyMelding.sendt;
        oldDialog.henvendelser.push(nyMelding);

        if (!bruker().erVeileder) {
            oldDialog.ferdigBehandlet = false;
            oldDialog.venterPaSvar = false;
        }

        return oldDialog as DialogData;
    } else {
        const nyDialog: DialogData = {
            id: nyMelding.dialogId,
            overskrift:
                body.overskrift === undefined || body.overskrift === null ? rndId().toString() : body.overskrift,
            sisteTekst: body.tekst,
            sisteDato: new Date().toISOString(),
            opprettetDato: new Date().toISOString(),
            historisk: false,
            lest: true,
            venterPaSvar: false,
            ferdigBehandlet: bruker().erVeileder,
            lestAvBrukerTidspunkt: null,
            erLestAvBruker: false,
            aktivitetId: body.aktivitetId || null,
            henvendelser: [nyMelding],
            egenskaper: []
        };
        dialoger.push(nyDialog);
        return nyDialog as DialogData;
    }
};

export function setVenterPaSvar(req: StrictRequest<DefaultBodyType>, params: PathParams) {
    const dialog = dialoger.find((dlg) => dlg.id === params.dialogId);
    if (dialog) {
        dialog.venterPaSvar = params.bool === 'true';
    }
    return dialog as DialogData;
}

export function setFerdigBehandlet(req: StrictRequest<DefaultBodyType>, params: PathParams) {
    const dialog = dialoger.find((dlg) => dlg.id === params.dialogId);
    if (dialog) {
        dialog.ferdigBehandlet = params.bool === 'true';
    }
    return dialog as DialogData;
}

export const opprettDialogEtterRender = () => {
    setTimeout(() => {
        const dialogId = Math.floor(Math.random() * 100);
        const nyDialog: DialogData = {
            id: `${dialogId}`,
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
                    dialogId: `${dialogId}`,
                    avsender: 'VEILEDER',
                    avsenderId: 'Z123456',
                    sendt: new Date().toISOString(),
                    lest: false,
                    viktig: false,
                    tekst: 'Halla, hvordan ser dette ut?'
                }
            ],
            egenskaper: []
        };
        dialoger.push(nyDialog);
        const meldingsData: MeldingsData = {
            id: rndId(),
            dialogId: '2',
            avsender: erEksternBruker() ? 'NAV' : 'BRUKER',
            avsenderId: 'Z123456',
            sendt: new Date().toISOString(),
            lest: false,
            viktig: false,
            tekst: 'Hei, hvordan går det?'
        };
        const d = dialoger.find((d) => d.id === '2');
        d!.henvendelser.push(meldingsData);
        d!.lest = false;
    }, 2000);
};

export const kladder: KladdData[] = [
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

const dialog = () => {
    return harIngenDialoger() ? [] : [...dialoger];
};

export default dialog;
