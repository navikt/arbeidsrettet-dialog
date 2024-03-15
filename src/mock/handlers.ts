import { ResponseComposition, RestContext, RestRequest, rest } from 'msw';

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

const jsonResponse = (response: object | null | boolean | ((req: RestRequest) => object)) => {
    return async (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        if (typeof response === 'function') {
            return res(ctx.json(await response(req)));
        }
        return res(ctx.json(response));
    };
};

const failOrGetResponse = (shouldFail: () => boolean, successFn: (req: RestRequest) => object | undefined) => {
    return async (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
        if (shouldFail()) {
            return res(...internalServerError(ctx));
        }
        return res(ctx.json(await successFn(req)));
    };
};

const internalServerError = (ctx: RestContext) => {
    return [
        ctx.status(500, 'Internal server error'),
        ctx.json({
            id: '9170c6534ed5eca272d527cd30c6a458',
            type: 'UKJENT',
            detaljer: {
                detaljertType: 'javax.ws.rs.InternalServerErrorException',
                feilMelding: 'HTTP 500 Internal Server Error',
                stackTrace: 'javax.ws.rs.InternalServerErrorException: HTTP 500 Internal Server Error\r\n\t'
            }
        })
    ];
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
    rest.get('/auth/info', jsonResponse({ remainingSeconds: 60 * 60 })),
    rest.get('https://login.ekstern.dev.nav.no/oauth2/session', jsonResponse(sessionPayload)),
    rest.post('https://amplitude.nav.no/collect-auto', (_, res, ctx) => res(ctx.status(200))),
    // veilarbdialog
    rest.get('/veilarbdialog/api/kladd', jsonResponse(kladder)),
    rest.get('/veilarbdialog/api/dialog', failOrGetResponse(harDialogFeilerSkruddPa, dialoger)),
    rest.put('/veilarbdialog/api/dialog/:dialogId/les', jsonResponse(lesDialog)),
    rest.put('/veilarbdialog/api/dialog/:dialogId/venter_pa_svar/:bool', jsonResponse(setVenterPaSvar)),
    rest.put('/veilarbdialog/api/dialog/:dialogId/ferdigbehandlet/:bool', jsonResponse(setFerdigBehandlet)),
    rest.get('/veilarbdialog/api/dialog/sistOppdatert', jsonResponse(getSistOppdatert())),
    rest.post('/veilarbdialog/api/kladd', (_, res, ctx) => {
        return res(ctx.delay(500), ctx.status(204));
    }),
    rest.post(
        '/veilarbdialog/api/dialog',
        failOrGetResponse(harNyDialogEllerSendMeldingFeilerSkruddPa, opprettEllerOppdaterDialog)
    ),
    rest.post('/veilarbdialog/api/logger/event', (_, res, ctx) => res(ctx.status(200))),

    // veilarboppfolging
    rest.get('/veilarboppfolging/api/oppfolging/me', jsonResponse(bruker)),
    rest.post('/veilarboppfolging/api/v3/oppfolging/hent-status', jsonResponse(oppfolging)),
    rest.post('/veilarboppfolging/api/oppfolging/settDigital', jsonResponse({})),

    // veilarbaktivitet
    rest.get(
        '/veilarbaktivitet/api/aktivitet',
        failOrGetResponse(harAktivitetFeilerSkruddPa, () => aktiviteter)
    ),
    rest.get(
        '/veilarbaktivitet/api/arena/tiltak',
        failOrGetResponse(harArenaaktivitetFeilerSkruddPa, () => arenaAktiviteter)
    ),
    rest.get('/veilarbaktivitet/api/feature', (_, res, ctx) =>
        res(ctx.json({ [FeatureToggle.USE_WEBSOCKETS]: false }))
    ),

    // veilarbveileder
    rest.get(`/veilarbveileder/api/veileder/me`, jsonResponse(veilederMe)),

    // veilarbperson
    rest.get(`/veilarbperson/api/person/:fnr/harNivaa4`, failOrGetResponse(harNivaa4Fieler, harNivaa4Data))
];
