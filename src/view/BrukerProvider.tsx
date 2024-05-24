import React, { useContext, useEffect, useState } from 'react';

import { Status, isReloading } from '../api/typer';
import { OppfolgingsApi } from '../api/UseApiBasePath';
import { fetchData } from '../utils/Fetch';
import { Bruker } from '../utils/Typer';
import { createGenericStore } from '../utils/genericStore';
import { useShallow } from 'zustand/react/shallow';

export interface BrukerDataProviderType {
    data: Bruker | null;
    status: Status;
    error?: string;
}

export const UserInfoContext = React.createContext<Bruker | null>(null);
const apiUrl = OppfolgingsApi.me;

export const useBrukerDataStore = createGenericStore(null as Bruker | null, () => fetchData<Bruker>(apiUrl));
export const useUserInfoContext = () => useBrukerDataStore(useShallow((state) => state.data));
export const useBrukerDataProvider = (): BrukerDataProviderType => {
    const { data, error, status } = useBrukerDataStore(
        useShallow((state) => ({
            data: state.data,
            status: state.status,
            error: state.error
        }))
    );
    return {
        data,
        status,
        error
    };
};
