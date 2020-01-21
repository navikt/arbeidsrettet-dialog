import React, { useContext } from 'react';
import useFetch, { FetchResult, hasData, Status } from '@nutgaard/use-fetch';
import { Aktivitet, ArenaAktivitet } from '../utils/AktivitetTypes';
import { fnrQuery } from '../utils/Fetch';
import { StringOrNull } from '../utils/Typer';

export type MaybeAktivitet = Aktivitet | ArenaAktivitet | undefined;

interface AktivitetResponse {
    aktiviteter: Aktivitet[];
}
export interface AktivitetContextType {
    aktiviteter: FetchResult<AktivitetResponse>;
    arenaAktiviter: FetchResult<ArenaAktivitet[]>;
}

const inital: AktivitetContextType = {
    aktiviteter: {
        status: Status.INIT,
        statusCode: 0,
        rerun(): void {}
    },
    arenaAktiviter: {
        status: Status.INIT,
        statusCode: 0,
        rerun(): void {}
    }
};

export const AktivitetContext = React.createContext(inital);
export const useAktivitetContext = () => useContext(AktivitetContext);

export function isLoadingData(aktivitetData: AktivitetContextType): boolean {
    const aktiviteter = hasData(aktivitetData.aktiviteter);
    const arena = hasData(aktivitetData.arenaAktiviter);

    return !aktiviteter || !arena;
}

export function findAktivitet(aktivitetData: AktivitetContextType, aktivitetId?: StringOrNull): MaybeAktivitet {
    if (!aktivitetId) {
        return undefined;
    }

    const aktiviteter = hasData(aktivitetData.aktiviteter) ? aktivitetData.aktiviteter.data.aktiviteter : undefined;
    const arena = hasData(aktivitetData.arenaAktiviter) ? aktivitetData.arenaAktiviter.data : undefined;

    if (aktivitetId.startsWith('ARENA')) {
        return arena && arena.find(a => a.id === aktivitetId);
    }
    return aktiviteter && aktiviteter.find(a => a.id === aktivitetId);
}

interface Props {
    fnr?: string;
    children: React.ReactNode;
}

export function AktivitetProvider(props: Props) {
    const query = fnrQuery(props.fnr);

    const aktiviteterFetch = useFetch<AktivitetResponse>('/veilarbaktivitet/api/aktivitet' + query);
    const arenaAktiviteterFetch = useFetch<ArenaAktivitet[]>('/veilarbaktivitet/api/aktivitet/arena' + query);

    return (
        <AktivitetContext.Provider value={{ aktiviteter: aktiviteterFetch, arenaAktiviter: arenaAktiviteterFetch }}>
            {props.children}
        </AktivitetContext.Provider>
    );
}