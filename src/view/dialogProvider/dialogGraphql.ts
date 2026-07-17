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
        sisteTekst,
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
            lest,
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
        .then(toJson);
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
        .then(toJson);
};
