import { DefaultBodyType, delay, http, HttpResponse, HttpResponseResolver, PathParams, StrictRequest } from 'msw';

import aktiviteter from './Aktivitet';
import { arenaAktiviteter } from './Arena';
import bruker from './Bruker';
import {
    harAktivitetFeilerSkruddPa,
    harArenaaktivitetFeilerSkruddPa,
    harDialogFeilerSkruddPa,
    harNyDialogEllerSendMeldingFeilerSkruddPa,
    ingenOppfPerioder
} from './demo/localstorage';
import dialoger, { lesDialog, opprettEllerOppdaterDialog, setFerdigBehandlet, setVenterPaSvar } from './Dialog';
import oppfolging from './Oppfolging';
import { getSistOppdatert } from './SistOppdatert';
import { veilederMe } from './Veileder';
import { addMinutes } from 'date-fns';
import { FeatureToggle } from '../featureToggle/const';
import { Aktivitet } from '../utils/aktivitetTypes';
import { AktivitetsplanResponse } from '../api/aktivitetsplanGraphql';

const jsonResponse = (
    response: object | null | boolean | ((req: StrictRequest<DefaultBodyType>, params: PathParams) => object)
): HttpResponseResolver => {
    return async ({ request, params }) => {
        if (typeof response === 'function') {
            return HttpResponse.json(await response(request, params));
        }
        await delay(1000);
        return HttpResponse.json(response);
    };
};

const failOrGetResponse = (
    shouldFail: () => boolean,
    successFn: (req: StrictRequest<DefaultBodyType>) => Promise<Record<any, any>>,
    delayMs = 1000
): HttpResponseResolver => {
    return async ({ request }) => {
        if (shouldFail()) {
            return internalServerError;
        }
        await delay(delayMs);
        return HttpResponse.json(await successFn(request));
    };
};

const internalServerError = HttpResponse.json(
    {
        id: '9170c6534ed5eca272d527cd30c6a458',
        type: 'UKJENT',
        detaljer: {
            detaljertType: 'javax.ws.rs.InternalServerErrorException',
            feilMelding: 'HTTP 500 Internal Server Error',
            stackTrace: 'javax.ws.rs.InternalServerErrorException: HTTP 500 Internal Server Error\r\n\t'
        }
    },
    { status: 500 }
);

const now = new Date();
const sessionPayload = {
    session: {
        created_at: now.toISOString(),
        ends_at: addMinutes(now, 15).toISOString(),
        timeout_at: addMinutes(now, 15).toISOString(),
        ends_in_seconds: 3600,
        active: true,
        timeout_in_seconds: 3600
    },
    tokens: {
        expire_at: addMinutes(now, 15).toISOString(),
        refreshed_at: now.toISOString(),
        expire_in_seconds: 3600,
        next_auto_refresh_in_seconds: 1000,
        refresh_cooldown: true,
        refresh_cooldown_seconds: 1000
    }
};

export const handlers = [
    http.get('/auth/info', () => HttpResponse.json({ remainingSeconds: 60 * 60 })),
    http.get('https://login.ekstern.dev.nav.no/oauth2/session', () => HttpResponse.json(sessionPayload)),
    http.post('https://amplitude.nav.no/collect-auto', () => new Response()),
    // veilarbdialog
    http.put('/veilarbdialog/api/dialog/:dialogId/les', lesDialog),
    http.put('/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool', jsonResponse(setVenterPaSvar)),
    http.put('/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool', jsonResponse(setFerdigBehandlet)),
    http.post('/veilarbdialog/api/dialog/sistOppdatert', jsonResponse(getSistOppdatert())),
    http.post('/veilarbdialog/api/kladd', async () => {
        await delay(500);
        return new HttpResponse(null, { status: 204 });
    }),
    http.post(
        '/veilarbdialog/api/dialog',
        failOrGetResponse(harNyDialogEllerSendMeldingFeilerSkruddPa, opprettEllerOppdaterDialog)
    ),
    http.post('/veilarbdialog/api/logger/event', () => new Response()),
    http.post(
        '/veilarbdialog/graphql',
        failOrGetResponse(
            harDialogFeilerSkruddPa,
            async (request) => {
                const dialogerPayload = ingenOppfPerioder() ? [] : dialoger();
                return { data: { dialoger: dialogerPayload, kladder: [] }, errors: [] };
            },
            500
        )
    ),

    // veilarboppfolging
    http.get('/veilarboppfolging/api/oppfolging/me', jsonResponse(bruker)),
    http.post('/veilarboppfolging/api/v3/oppfolging/hent-status', jsonResponse(oppfolging)),
    http.post('/veilarboppfolging/api/oppfolging/settDigital', jsonResponse({})),

    // veilarbaktivitet
    http.post(
        '/veilarbaktivitet/graphql',
        failOrGetResponse(harAktivitetFeilerSkruddPa, async () => matchMedPerioder(aktiviteter), 750)
    ),
    http.post(
        '/veilarbaktivitet/api/arena/tiltak',
        failOrGetResponse(harArenaaktivitetFeilerSkruddPa, async () => arenaAktiviteter)
    ),
    http.get('/veilarbaktivitet/api/feature', () => {
        return HttpResponse.json({ [FeatureToggle.USE_WEBSOCKETS]: false });
    }),

    // veilarbveileder
    http.get(`/veilarbveileder/api/veileder/me`, jsonResponse(veilederMe))
];

const matchMedPerioder = (aktiviteter: Aktivitet[]): AktivitetsplanResponse => {
    const aktivteterOnPerioder = aktiviteter.reduce(
        (acc, aktivitet) => {
            const periodeAktiviteter = acc[aktivitet.oppfolgingsperiodeId] || [];
            return {
                ...acc,
                [aktivitet.oppfolgingsperiodeId]: [...periodeAktiviteter, aktivitet]
            };
        },
        {} as Record<string, Aktivitet[]>
    );
    const perioderMedAktivtieter = Object.keys(aktivteterOnPerioder).map((periode) => ({
        id: periode,
        aktiviteter: aktivteterOnPerioder[periode]
    }));
    return {
        data: {
            perioder: perioderMedAktivtieter
        },
        errors: []
    };
};
