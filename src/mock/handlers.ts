import { HttpResponse, delay, http } from 'msw';

import aktiviteter from './Aktivitet';
import { arenaAktiviteter } from './Arena';
import bruker from './Bruker';
import {
    harAktivitetFeilerSkruddPa,
    harArenaaktivitetFeilerSkruddPa,
    harDialogFeilerSkruddPa,
    harNivaa4Fieler,
    harNyDialogEllerSendMeldingFeilerSkruddPa
} from './demo/localstorage';
import dialoger, {
    kladder,
    lesDialog,
    opprettEllerOppdaterDialog,
    setFerdigBehandlet,
    setVenterPaSvar
} from './Dialog';
import { harNivaa4Data } from './HarNivaa4';
import oppfolging from './Oppfolging';
import { getSistOppdatert } from './SistOppdatert';
import { veilederMe } from './Veileder';
import { addMinutes } from 'date-fns';
import { FeatureToggle } from '../featureToggle/const';

interface RequestInfo {
    request: Request;
    params: object;
    cookies: object;
}

const jsonResponse = (response: object | null | boolean | ((requestInfo: Request) => object)) => {
    return async ({ request }: RequestInfo) => {
        if (typeof response === 'function') {
            await delay(2000);
            return HttpResponse.json(await response(request));
        }
        await delay(2000);
        return HttpResponse.json(response);
    };
};

const failOrGetResponse = (shouldFail: () => boolean, successFn: (req: Request) => object | undefined) => {
    return async ({ request }: RequestInfo) => {
        await delay(2000);
        if (shouldFail()) {
            return internalServerError();
        }
        return HttpResponse.json(await successFn(request));
    };
};

const internalServerError = () => {
    return HttpResponse.json(
        {
            id: '9170c6534ed5eca272d527cd30c6a458',
            type: 'UKJENT',
            detaljer: {
                detaljertType: 'javax.ws.rs.InternalServerErrorException',
                feilMelding: 'HTTP 500 Internal Server Error',
                stackTrace: 'javax.ws.rs.InternalServerErrorException: HTTP 500 Internal Server Error\r\n\t'
            }
        },
        { status: 500, statusText: 'Internal server error' }
    );
};

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
    http.get('/auth/info', jsonResponse({ remainingSeconds: 60 * 60 })),
    http.get('https://login.ekstern.dev.nav.no/oauth2/session', jsonResponse(sessionPayload)),
    http.post('https://amplitude.nav.no/collect-auto', async (_) => {
        return new HttpResponse(undefined, { status: 200 });
    }),
    // veilarbdialog
    http.get('/veilarbdialog/api/kladd', jsonResponse(kladder)),
    http.get('/veilarbdialog/api/dialog', failOrGetResponse(harDialogFeilerSkruddPa, dialoger)),
    http.put('/veilarbdialog/api/dialog/:dialogId/les', jsonResponse(lesDialog)),
    http.put('/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool', jsonResponse(setVenterPaSvar)),
    http.put('/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool', jsonResponse(setFerdigBehandlet)),
    http.get('/veilarbdialog/api/dialog/sistOppdatert', jsonResponse(getSistOppdatert())),
    http.post('/veilarbdialog/api/kladd', async (_) => {
        await delay(500);
        return new HttpResponse(undefined, { status: 204 });
    }),
    http.post(
        '/veilarbdialog/api/dialog',
        failOrGetResponse(harNyDialogEllerSendMeldingFeilerSkruddPa, opprettEllerOppdaterDialog)
    ),
    http.post('/veilarbdialog/api/logger/event', async (_ctx) => {
        return new HttpResponse(undefined, { status: 200 });
    }),

    // veilarboppfolging
    http.get('/veilarboppfolging/api/oppfolging/me', jsonResponse(bruker)),
    http.get('/veilarboppfolging/api/oppfolging', jsonResponse(oppfolging)),
    http.post('/veilarboppfolging/api/oppfolging/settDigital', jsonResponse({})),

    // veilarbaktivitet
    http.get(
        '/veilarbaktivitet/api/aktivitet',
        failOrGetResponse(harAktivitetFeilerSkruddPa, () => aktiviteter)
    ),
    http.get(
        '/veilarbaktivitet/api/arena/tiltak',
        failOrGetResponse(harArenaaktivitetFeilerSkruddPa, () => arenaAktiviteter)
    ),
    http.get('/veilarbaktivitet/api/feature', (_) => HttpResponse.json({ [FeatureToggle.USE_WEBSOCKETS]: false })),

    // veilarbveileder
    http.get(`/veilarbveileder/api/veileder/me`, jsonResponse(veilederMe)),

    // veilarbperson
    http.get(`/veilarbperson/api/person/:fnr/harNivaa4`, failOrGetResponse(harNivaa4Fieler, harNivaa4Data))
];
