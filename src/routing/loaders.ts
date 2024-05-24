import { useFeatureToggleStore } from '../featureToggle/FeatureToggleProvider';
import { defer, useRouteLoaderData } from 'react-router';
import { useDialogStore } from '../view/dialogProvider/dialogStore';
import { useBrukerDataStore } from '../view/BrukerProvider';
import { useOppfolgingStore } from '../view/OppfolgingProvider';
import { useVeilederNavnStore } from '../api/useHentVeilederData';
import { useAktivitetStore, useTiltaksAktivitetStore } from '../view/AktivitetProvider';
import { RouteIds } from './routes';

export const initialPageLoader = (fnr: string | undefined) => async () => {
    return defer({
        features: useFeatureToggleStore.getState().fetch(),
        dialoger: useDialogStore.getState().hentDialoger(fnr),
        me: useBrukerDataStore.getState().fetch(),
        oppfolging: useOppfolgingStore.getState().fetch(),
        veilederNavn: fnr ? useVeilederNavnStore.getState().fetch() : Promise.resolve(null),
        aktiviteter: useAktivitetStore.getState().fetch(fnr),
        arenaAktiviteter: useTiltaksAktivitetStore.getState().fetch(fnr)
    });
};

export const useRootLoaderData = () =>
    useRouteLoaderData(RouteIds.Root) as {
        features: Promise<void>;
        dialoger: Promise<void>;
        me: Promise<void>;
        oppfolging: Promise<void>;
        veilederNavn: Promise<void>;
        aktiviteter: Promise<void>;
        arenaAktiviteter: Promise<void>;
    };
