import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Status, hasError, isReloading } from '../api/typer';
import { AktivitetApi } from '../api/UseApiBasePath';
import { Aktivitet, ArenaAktivitet } from '../utils/aktivitetTypes';
import { fetchData } from '../utils/Fetch';
import { StringOrNull } from '../utils/Typer';
import { hentAktiviteterGraphql } from '../api/aktivitetsplanGraphql';
import { createGenericStore } from '../utils/genericStore';
import { useShallow } from 'zustand/react/shallow';

export type MaybeAktivitet = Aktivitet | ArenaAktivitet | undefined;

export interface AktivitetDataProviderType {
    aktiviteterStatus: Status;
    arenaAktiviteterStatus: Status;
    aktiviteter: Aktivitet[];
    arenaAktiviteter: ArenaAktivitet[];
}

export interface AktivitetState {
    aktiviteterStatus: Status;
    arenaAktiviteterStatus: Status;
    aktiviteter: Aktivitet[];
    arenaAktiviteter: ArenaAktivitet[];
}

export const AktivitetContext = React.createContext<AktivitetDataProviderType>({
    aktiviteterStatus: Status.INITIAL,
    arenaAktiviteterStatus: Status.INITIAL,
    aktiviteter: new Array<Aktivitet>(),
    arenaAktiviteter: new Array<ArenaAktivitet>()
});

export const useAktivitetContext = () => useAktivitetDataProvider();
export const useHentAktiviteter = () => {
    const hentVeilarbAktiviteter = useAktivitetStore(useShallow((state) => state.fetch));
    const hentTiltaksAktiviteter = useTiltaksAktivitetStore(useShallow((state) => state.fetch));
    return (fnr: string | undefined) => {
        hentVeilarbAktiviteter(fnr);
        hentTiltaksAktiviteter(fnr);
    };
};

export function harAktivitetDataFeil(aktivitetData: AktivitetDataProviderType, arenaAktivitet: boolean): boolean {
    if (arenaAktivitet) {
        return hasError(aktivitetData.arenaAktiviteterStatus);
    } else {
        return hasError(aktivitetData.aktiviteterStatus);
    }
}

export const findAktivitet = (aktivitetData: AktivitetDataProviderType, aktivitetId?: StringOrNull): MaybeAktivitet => {
    if (!aktivitetId) return undefined;

    const aktiviteterHasData =
        aktivitetData.aktiviteterStatus === Status.OK || aktivitetData.aktiviteterStatus === Status.RELOADING;
    const aktiviteter: Aktivitet[] = aktiviteterHasData ? aktivitetData.aktiviteter : [];

    const arenaHasData =
        aktivitetData.arenaAktiviteterStatus === Status.OK || aktivitetData.arenaAktiviteterStatus === Status.RELOADING;
    const arena: ArenaAktivitet[] = arenaHasData ? aktivitetData.arenaAktiviteter : [];

    return [...aktiviteter, ...arena].find((aktivitet) => aktivitet.id === aktivitetId);
};

const arenaAktivitetUrl = AktivitetApi.hentArenaAktiviteter;

const hentVeilarbAktiviteter = (fnr: string | undefined) =>
    hentAktiviteterGraphql(fnr).then((response) => response.data.perioder.flatMap((periode) => periode.aktiviteter));
export const useAktivitetStore = createGenericStore<undefined | Aktivitet[], string | undefined, Aktivitet[]>(
    undefined,
    hentVeilarbAktiviteter
);
const hentTiltaksAktiviteter = (fnr: string | undefined) =>
    fetchData<ArenaAktivitet[]>(arenaAktivitetUrl, {
        method: 'POST',
        body: JSON.stringify({ fnr })
    });
export const useTiltaksAktivitetStore = createGenericStore<
    undefined | ArenaAktivitet[],
    string | undefined,
    ArenaAktivitet[]
>(undefined, hentTiltaksAktiviteter);

export const useAktivitetDataProvider = (): AktivitetDataProviderType => {
    const { aktiviteter, aktiviteterStatus } = useAktivitetStore(
        useShallow((state) => ({ aktiviteterStatus: state.status, aktiviteter: state.data }))
    );
    const { arenaAktiviteter, arenaAktiviteterStatus } = useTiltaksAktivitetStore(
        useShallow((state) => ({ arenaAktiviteterStatus: state.status, arenaAktiviteter: state.data }))
    );
    return {
        aktiviteterStatus,
        arenaAktiviteterStatus,
        aktiviteter: aktiviteter || [],
        arenaAktiviteter: arenaAktiviteter || []
    };
};
