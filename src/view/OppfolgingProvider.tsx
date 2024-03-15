import React, { useContext, useMemo, useState } from 'react';

import { Status, isReloading } from '../api/typer';
import { OppfolgingsApi } from '../api/UseApiBasePath';
import { fetchData } from '../utils/Fetch';
import { OppfolgingData } from '../utils/Typer';

export interface OppfolgingDataProviderType {
    data?: OppfolgingData;
    status: Status;
    hentOppfolging: (fnr: string | undefined) => Promise<OppfolgingData | undefined>;
}

interface OppfolgingState {
    data?: OppfolgingData;
    status: Status;
}

const initOppfolgingState: OppfolgingState = {
    data: undefined,
    status: Status.INITIAL
};

export const OppfolgingContext = React.createContext<OppfolgingDataProviderType>({
    data: undefined,
    status: Status.INITIAL,
    hentOppfolging: () => Promise.resolve(undefined)
});
export const useOppfolgingContext = () => useContext(OppfolgingContext);

const oppfolgingUrl = OppfolgingsApi.oppfolgingUrl;

export const useOppfolgingDataProvider = () => {
    const [state, setState] = useState<OppfolgingState>(initOppfolgingState);

    const hentOppfolging: (fnr: string | undefined) => Promise<OppfolgingData | undefined> = (
        fnr: string | undefined
    ) => {
        setState((prevState) => ({
            ...prevState,
            status: isReloading(prevState.status) ? Status.RELOADING : Status.PENDING
        }));
        return fetchData<OppfolgingData>(oppfolgingUrl, {
            method: 'POST',
            body: fnr ? JSON.stringify({ fnr }) : undefined
        })
            .then((response) => {
                setState(() => ({
                    data: response,
                    status: Status.OK
                }));
                return response;
            })
            .catch(() => {
                setState((prevState) => ({
                    ...prevState,
                    status: Status.ERROR
                }));
                return undefined;
            });
    };

    return useMemo(() => {
        return {
            data: state.data,
            status: state.status,
            hentOppfolging: hentOppfolging
        };
    }, [state]);
};
