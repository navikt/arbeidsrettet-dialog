import { Alert, Loader } from '@navikt/ds-react';
import React, { useContext, useEffect } from 'react';

import { Status, hasData, hasError, isPending } from '../api/typer';
import useFetchHarNivaa4, { HarNivaa4Response } from '../api/useFetchHarNivaa4';
import useFetchVeilederNavn from '../api/useHentVeilederData';
import { AktivitetContext, useAktivitetDataProvider } from './AktivitetProvider';
import { AktivitetToggleProvider } from './AktivitetToggleContext';
import { BrukerDataProviderType, UserInfoContext, useBrukerDataProvider } from './BrukerProvider';
import { DialogContext, hasDialogError, isDialogPending, useDialogDataProvider } from './DialogProvider';
import { FeatureToggleContext, useFeatureToggleProvider } from '../featureToggle/FeatureToggleProvider';
import { KladdContext, useKladdDataProvider } from './KladdProvider';
import { OppfolgingContext, useOppfolgingDataProvider } from './OppfolgingProvider';
import { ViewStateProvider } from './ViewState';
import { useDialogStore } from './dialogProvider/dialogStore';
import { useShallow } from 'zustand/react/shallow';
import { useHentDialoger } from './dialogProvider/storeHooks';

interface VeilederData {
    veilederNavn?: string;
}

export const FNRContext = React.createContext<string | undefined>(undefined);
export const VeilederDataContext = React.createContext<VeilederData>({});
export const HarNivaa4Context = React.createContext<HarNivaa4Response>({
    harNivaa4: false,
    isPending: false,
    hasError: false
});

export const useFnrContext = () => useContext(FNRContext);
export const useVeilederDataContext = () => useContext(VeilederDataContext);
export const useHarNivaa4Context = () => useContext(HarNivaa4Context);

type ProviderType<T> = {
    data?: T;
    status: Status;
};

export function dataOrUndefined<T>(context: ProviderType<T>): T | undefined {
    return hasData(context.status) ? context.data : undefined;
}

interface Props {
    fnr?: string;
    enhet?: string;
    erVeileder: boolean;
    children: React.ReactNode;
    visAktivitetDefault?: boolean;
}

export function Provider(props: Props) {
    const { fnr, erVeileder, children, visAktivitetDefault } = props;

    const veilederNavn = useFetchVeilederNavn(erVeileder);

    const { data: feature, status: featureStatus } = useFeatureToggleProvider();
    const { data: bruker, status: brukerstatus }: BrukerDataProviderType = useBrukerDataProvider();
    const oppfolgingDataProvider = useOppfolgingDataProvider();
    const { status: oppfolgingstatus, hentOppfolging } = oppfolgingDataProvider;

    const harLoggetInnNiva4 = useFetchHarNivaa4(erVeileder, fnr);
    const dialogDataProvider = useDialogDataProvider();

    const aktivitetDataProvider = useAktivitetDataProvider();
    const kladdDataProvider = useKladdDataProvider();

    const hentDialoger = useHentDialoger();
    const { configurePoll, stopPolling, dialogstatus } = useDialogStore(
        useShallow((store) => ({
            configurePoll: store.configurePoll,
            stopPolling: store.stopPolling,
            dialogstatus: store.hentDialog.status
        }))
    );
    const { hentAktiviteter, hentArenaAktiviteter } = aktivitetDataProvider;
    const hentKladder = kladdDataProvider.hentKladder;

    useEffect(() => {
        hentOppfolging(fnr);
        hentAktiviteter(fnr);
        hentArenaAktiviteter(fnr);
        hentDialoger(fnr);
        hentKladder(fnr);
        return () => stopPolling();
    }, [fnr]);

    const brukerStatusErLastet = hasData(brukerstatus);
    const dialogStatusOk = hasData(dialogstatus);
    const featureStatusOk = hasData(featureStatus);

    const klarTilAaPolle = dialogStatusOk && bruker && brukerStatusErLastet && featureStatusOk;

    useEffect(() => {
        if (!klarTilAaPolle) return;
        configurePoll({
            erBruker: bruker?.erBruker,
            fnr,
            useWebsockets: feature['arbeidsrettet-dialog.websockets']
        });
    }, [klarTilAaPolle, fnr]);

    if (
        isDialogPending(dialogstatus) ||
        isPending(brukerstatus) ||
        isPending(oppfolgingstatus) ||
        harLoggetInnNiva4.isPending
    ) {
        return (
            <div className="flex flex-1 justify-center self-center">
                <Loader size="3xlarge" />
            </div>
        );
    } else if (hasError(brukerstatus) || hasError(oppfolgingstatus) || hasDialogError(dialogstatus)) {
        if (hasError(brukerstatus)) {
            return <Alert variant="error">Kunne ikke hente brukerinfo. Prøv igjen senere.</Alert>;
        }
        if (hasError(oppfolgingstatus)) {
            return <Alert variant="error">Kunne ikke hente oppfølgingstatus. Prøv igjen senere.</Alert>;
        }
        return <Alert variant="error">Kunne ikke hente dialoger. Prøv igjen senere.</Alert>;
    }

    return (
        <DialogContext.Provider value={dialogDataProvider}>
            <OppfolgingContext.Provider value={oppfolgingDataProvider}>
                <HarNivaa4Context.Provider value={harLoggetInnNiva4}>
                    <UserInfoContext.Provider value={bruker}>
                        <AktivitetContext.Provider value={aktivitetDataProvider}>
                            <VeilederDataContext.Provider value={{ veilederNavn }}>
                                <KladdContext.Provider value={kladdDataProvider}>
                                    <FNRContext.Provider value={fnr}>
                                        <ViewStateProvider>
                                            <FeatureToggleContext.Provider value={feature}>
                                                <AktivitetToggleProvider defaultValue={visAktivitetDefault || false}>
                                                    {children}
                                                </AktivitetToggleProvider>
                                            </FeatureToggleContext.Provider>
                                        </ViewStateProvider>
                                    </FNRContext.Provider>
                                </KladdContext.Provider>
                            </VeilederDataContext.Provider>
                        </AktivitetContext.Provider>
                    </UserInfoContext.Provider>
                </HarNivaa4Context.Provider>
            </OppfolgingContext.Provider>
        </DialogContext.Provider>
    );
}
