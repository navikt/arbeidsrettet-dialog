import { Features, useFeatureToggleStore } from '../featureToggle/FeatureToggleProvider';
import { useRouteLoaderData } from 'react-router';
import { useDialogStore } from '../view/dialogProvider/dialogStore';
import { useBrukerDataStore } from '../view/BrukerProvider';
import { useOppfolgingStore } from '../view/OppfolgingProvider';
import { useVeilederNavnStore, VeilederInfo } from '../api/useHentVeilederData';
import { useAktivitetStore, useTiltaksAktivitetStore } from '../view/AktivitetProvider';
import { RouteIds } from './routes';
import { Bruker, DialogData, OppfolgingData } from '../utils/Typer';
import { Aktivitet, ArenaAktivitet } from '../utils/aktivitetTypes';
import { useInnsynsrettStore } from '../api/useInnsynsrett';

interface InitialLoaderData {
    features: Promise<Features>;
    dialoger: Promise<DialogData[]>;
    me: Promise<Bruker>;
    oppfolging: Promise<OppfolgingData>;
    veilederNavn: Promise<VeilederInfo | null>;
    aktiviteter: Promise<Aktivitet[]>;
    arenaAktiviteter: Promise<ArenaAktivitet[]>;
}

export const initialPageLoader = (fnr: string | undefined) => async () => {
    return {
        features: useFeatureToggleStore.getState().fetch(undefined),
        dialoger: useDialogStore.getState().hentVeilarbdialogData(fnr),
        me: useBrukerDataStore.getState().fetch(undefined),
        oppfolging: useOppfolgingStore.getState().fetch(fnr),
        veilederNavn: fnr ? useVeilederNavnStore.getState().fetch(fnr) : Promise.resolve(null),
        aktiviteter: useAktivitetStore.getState().fetch(fnr),
        arenaAktiviteter: useTiltaksAktivitetStore.getState().fetch(fnr),
        innsynsrett: useInnsynsrettStore.getState().fetch(fnr),
    };
};

export const useRootLoaderData = () => useRouteLoaderData(RouteIds.Root) as InitialLoaderData;
