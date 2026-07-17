import z from 'zod';
import { DialogApi } from '../../api/UseApiBasePath';
import { sjekkStatuskode, toJson } from '../../utils/Fetch';
import { DialogData, KladdData, TilgangData } from '../../utils/Typer';
import { GraphqlError } from '../../utils/fetchErrors';
import { StansVarsel } from '../DialogProvider';

const dialogerQuery = `
    dialoger(fnr: $fnr, bareMedAktiviteter: $bareMedAktiviteter) {
        id,
        aktivitetId,
        overskrift,
        sisteDato,
        opprettetDato,
        oppfolgingsperiode,
        historisk,
        lest,
        venterPaSvar,
        ferdigBehandlet,
        lestAvBrukerTidspunkt,
        erLestAvBruker,
        oppfolgingsperiode,
        egenskaper,
        henvendelser {
            id,
            avsender,
            avsenderId,
            dialogId,
            sendt,
            tekst
        }
    }
`;

const kladdQuery = `
    kladder(fnr: $fnr) {
        aktivitetId,
        dialogId,
        tekst,
        overskrift
    }
`;

const dialogDataQuery = `
    query($fnr: String!, $bareMedAktiviteter: Boolean) {
        ${dialogerQuery}
        ${kladdQuery}
    }
`;

const veilarbDialogDataQuery = `
    query($fnr: String!, $bareMedAktiviteter: Boolean) {
        ${dialogerQuery}
        ${kladdQuery}
        tilgang(fnr: $fnr) {
            harSkrivetilgangTilBruker
        }
        stansVarsel(fnr: $fnr) {
            tilhorendeDialogId
        }
    }
`;

const queryBody = (query: string, fnr: string) => ({
    query,
    variables: {
        fnr,
        bareMedAktiviteter: false,
    },
});

interface GraphqlErrorMessage {
    message: string;
}

export interface GraphqlResponse<T> {
    data: T;
    errors: GraphqlErrorMessage[];
}

const sjekkGraphqlFeil = <T>(response: GraphqlResponse<T>): Promise<GraphqlResponse<T>> => {
    if ((response?.errors?.length || 0) != 0) {
        return Promise.reject(new GraphqlError('Kunne ikke hente dialoger', response.errors));
    }
    return Promise.resolve(response);
};

const meldingsDataSchema = z.object({
    id: z.string(),
    dialogId: z.string(),
    avsender: z.string(),
    avsenderId: z.string().nullable(),
    sendt: z.string(),
    tekst: z.string(),
});

const dialogerSchema = z.array(
    z.object({
        id: z.string(),
        aktivitetId: z.string().nullable(),
        overskrift: z.string().nullable(),
        sisteDato: z.string(),
        historisk: z.boolean(),
        lest: z.boolean(),
        venterPaSvar: z.boolean(),
        ferdigBehandlet: z.boolean(),
        lestAvBrukerTidspunkt: z.string().nullable(),
        henvendelser: z.array(meldingsDataSchema),
        egenskaper: z.array(z.string()),
    }),
);

const kladderSchema = z.array(
    z.object({
        dialogId: z.string().nullable(),
        aktivitetId: z.string().nullable(),
        overskrift: z.string().nullable(),
        tekst: z.string().nullable(),
    }),
);

const hentDialogerSchema = z.object({
    dialoger: dialogerSchema,
    kladder: kladderSchema,
});

const hentVeilarbdialogDataSchema = z.object({
    dialoger: dialogerSchema,
    kladder: kladderSchema,
    tilgang: z.object({
        harSkrivetilgangTilBruker: z.boolean(),
    }),
    stansVarsel: z
        .object({
            tilhorendeDialogId: z.string(),
        })
        .nullable(),
});

export const hentVeilarbdialogDataGraphql = async (
    fnr: string | undefined,
): Promise<
    GraphqlResponse<{
        dialoger: DialogData[];
        kladder: KladdData[];
        tilgang: TilgangData;
        stansVarsel: StansVarsel | null;
    }>
> => {
    return fetch(DialogApi.graphql, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'arbeidsrettet-dialog',
        },
        body: JSON.stringify(queryBody(veilarbDialogDataQuery, fnr || '')),
    })
        .then(sjekkStatuskode)
        .then(toJson)
        .then((responseData) => {
            const validationResult = hentVeilarbdialogDataSchema.safeParse(responseData.data);
            if (!validationResult.success) {
                console.warn(
                    'veilarbdialog graphql validation failed: ',
                    JSON.stringify(validationResult.error.issues),
                );
            }
            return responseData;
        });
};

export const hentDialogerGraphql = async (
    fnr: string | undefined,
): Promise<GraphqlResponse<{ dialoger: DialogData[]; kladder: KladdData[] }>> => {
    return fetch(DialogApi.graphql, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Nav-Consumer-Id': 'arbeidsrettet-dialog',
        },
        body: JSON.stringify(queryBody(dialogDataQuery, fnr || '')),
    })
        .then(sjekkStatuskode)
        .then(toJson)
        .then((responseData) => {
            const validationResult = hentDialogerSchema.safeParse(responseData.data);
            if (!validationResult.success) {
                console.warn(
                    'veilarbdialog graphql validation failed: ',
                    JSON.stringify(validationResult.error.issues),
                );
            }
            return responseData;
        });
};
