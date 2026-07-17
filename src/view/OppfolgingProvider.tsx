import { Status } from '../api/typer';
import { OppfolgingsApi } from '../api/UseApiBasePath';
import { fetchData } from '../utils/Fetch';
import { StringOrNull } from '../utils/Typer';
import { createGenericStore } from '../utils/genericStore';
import { useShallow } from 'zustand/react/shallow';
import z from 'zod';
import { GraphqlResponse } from './dialogProvider/dialogGraphql';

export interface OppfolgingDataProviderType {
    data?: OppfolgingDataGraphqlResponse;
    status: Status;
    hentOppfolging: (fnr: string | undefined) => Promise<OppfolgingDataGraphqlResponse | undefined>;
}

export interface OppfolgingDataGraphqlResponse {
    veilederTilgang: {
        harVeilederLeseTilgangTilBrukersKontorsperre: boolean;
    } | null;
    oppfolging: {
        erUnderOppfolging: boolean;
    };
    oppfolgingsPerioder: {
        id: string;
        startTidspunkt: string;
        sluttTidspunkt: StringOrNull;
        kvpPerioder: {
            startTidspunkt: string;
            sluttTidspunkt: StringOrNull;
        }[];
    }[];
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
    veilederTilgang: z
        .object({
            harVeilederLeseTilgangTilBrukersKontorsperre: z.boolean(),
        })
        .nullable(),
});

const oppfolgingStatusQuery = `
    query($fnr: String!) {
        brukerStatus(fnr: $fnr) {
            manuell {
                erManuell
            }
            krr {
                reservertIKrr
                kanVarsles
                registrertIKrr
            }
        }
        veilederTilgang(fnr: $fnr) {
            harVeilederLeseTilgangTilBrukersKontorsperre
        }
        oppfolging(fnr: $fnr) {
            erUnderOppfolging
        }
        oppfolgingsPerioder(fnr: $fnr) {
            id
            sluttTidspunkt
            kvpPerioder {
                startTidspunkt
                sluttTidspunkt
            }
        }
    }
`;

const fetchOppfolging = (fnr: string | undefined) =>
    fetchData<GraphqlResponse<OppfolgingDataGraphqlResponse>>(OppfolgingsApi.graphql, {
        method: 'POST',
        body: JSON.stringify({ query: oppfolgingStatusQuery, variables: { fnr: fnr || '' } }),
    }).then((it) => {
        const data = it.data;
        const validationResult = schema.safeParse(data);
        if (!validationResult.success) {
            console.warn(
                'Veilarboppfolging graphql validation failed: ',
                JSON.stringify(validationResult.error.issues),
            );
        }
        return it.data;
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

export const useErUnderKvp = () => {
    return (
        useOppfolgingContext()
            .data?.oppfolgingsPerioder.find((it) => !it.sluttTidspunkt)
            ?.kvpPerioder.find((it) => !it.sluttTidspunkt) || false
    );
};

export const useErUnderOppfolging = () => {
    return useOppfolgingStore(useShallow((store) => store.data?.oppfolging?.erUnderOppfolging || false));
};
