import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Status, isReloading } from '../api/typer';
import { fetchData, fnrQuery } from '../utils/Fetch';
import { OppfolgingData } from '../utils/Typer';
import { baseApiPath } from '../utils/UseApiBasePath';

export interface OppfolgingDataProviderType {
    data?: OppfolgingData;
    status: Status;
    hentOppfolging: () => Promise<OppfolgingData | undefined>;
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

export const useOppfolgingDataProvider = (fnr?: string) => {
    const [state, setState] = useState<OppfolgingState>(initOppfolgingState);

    const apiBasePath = baseApiPath(!!fnr);
    const query = fnrQuery(fnr);

    const oppfolgingUrl = useMemo(
        () => `${apiBasePath}/veilarboppfolging/api/oppfolging${query}`,
        [apiBasePath, query]
    );

    const hentOppfolging: () => Promise<OppfolgingData | undefined> = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            status: isReloading(prevState.status) ? Status.RELOADING : Status.PENDING
        }));
        return fetchData<OppfolgingData>(oppfolgingUrl)
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
    }, [oppfolgingUrl]);

    return useMemo(() => {
        return {
            data: state.data,
            status: state.status,
            hentOppfolging: hentOppfolging
        };
    }, [state, hentOppfolging]);
};
