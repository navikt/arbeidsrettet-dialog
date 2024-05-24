import { Status } from '../api/typer';
import { OppfolgingsApi } from '../api/UseApiBasePath';
import { fetchData } from '../utils/Fetch';
import { OppfolgingData } from '../utils/Typer';
import { createGenericStore } from '../utils/genericStore';
import { useShallow } from 'zustand/react/shallow';

export interface OppfolgingDataProviderType {
    data?: OppfolgingData;
    status: Status;
    hentOppfolging: (fnr: string | undefined) => Promise<OppfolgingData | undefined>;
}

const oppfolgingUrl = OppfolgingsApi.oppfolgingUrl;

const fetchOppfolging = (fnr: string | undefined) =>
    fetchData<OppfolgingData>(oppfolgingUrl, {
        method: 'POST',
        body: fnr ? JSON.stringify({ fnr }) : undefined
    });

export const useOppfolgingStore = createGenericStore<OppfolgingData | undefined, string | undefined, OppfolgingData>(
    undefined as OppfolgingData | undefined,
    fetchOppfolging
);
export const useOppfolgingContext = (): OppfolgingDataProviderType =>
    useOppfolgingStore(
        useShallow((store) => ({
            data: store.data,
            status: store.status,
            error: store.error,
            hentOppfolging: store.fetch
        }))
    );
