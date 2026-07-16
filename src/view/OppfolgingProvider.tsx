import { Status } from '../api/typer';
import { OppfolgingsApi } from '../api/UseApiBasePath';
import { fetchData } from '../utils/Fetch';
import { OppfolgingData } from '../utils/Typer';
import { createGenericStore } from '../utils/genericStore';
import { useShallow } from 'zustand/react/shallow';
import z from 'zod';

export interface OppfolgingDataProviderType {
    data?: OppfolgingDataGraphqlResponse;
    status: Status;
    hentOppfolging: (fnr: string | undefined) => Promise<OppfolgingDataGraphqlResponse | undefined>;
}

const oppfolgingUrl = OppfolgingsApi.oppfolgingUrl;

export interface OppfolgingDataGraphqlResponse {
    veilederTilgang: {
        harVeilederLeseTilgangTilBrukersKontorsperre: boolean;
    };
    oppfolging: {
        erUnderOppfolging: boolean;
    };
    brukerStatus: {
        manuell: {
            erManuell: boolean;
        };
        krr: {
            reservertIKrr: boolean;
            kanVarsles: boolean;
            registrertIKrr: boolean;
        };
    };
}

const schema = z.object({
    brukerStatus: z.object({
        manuell: z.object({
            erManuell: z.boolean().nullable(),
        }),
        krr: z.object({
            reservertIKrr: z.boolean(),
            kanVarsles: z.boolean(),
            registrertIKrr: z.boolean(),
        }),
    }),
    oppfolgingsPerioder: z.array(
        z.object({
            id: z.string(),
            sluttTidspunkt: z.string().optional().nullable(),
            kvpPerioder: z.array(
                z.object({
                    startTidspunkt: z.string(),
                    sluttTidspunkt: z.string().optional().nullable(),
                }),
            ),
        }),
    ),
    oppfolging: z.object({
        erUnderOppfolging: z.boolean(),
    }),
});

const fetchOppfolging = (fnr: string | undefined) =>
    fetchData<{ data: OppfolgingDataGraphqlResponse; errors: any[] }>(oppfolgingUrl, {
        method: 'POST',
        body: fnr ? JSON.stringify({ fnr }) : undefined,
    });

export const useOppfolgingStore = createGenericStore<
    OppfolgingDataGraphqlResponse | undefined,
    string | undefined,
    OppfolgingDataGraphqlResponse
>(undefined as OppfolgingDataGraphqlResponse | undefined, fetchOppfolging, 'hente oppfolging');
export const useOppfolgingContext = (): OppfolgingDataProviderType =>
    useOppfolgingStore(
        useShallow((store) => ({
            data: store.data,
            status: store.status,
            error: store.error,
            hentOppfolging: store.fetch,
        })),
    );
