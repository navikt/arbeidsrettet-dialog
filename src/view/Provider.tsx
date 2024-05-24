import React, { useContext, useEffect } from 'react';

import { Status, hasData } from '../api/typer';
import { AktivitetToggleProvider } from './AktivitetToggleContext';
import { BrukerDataProviderType, useBrukerDataProvider } from './BrukerProvider';
import { DialogContext, useDialogDataProvider } from './DialogProvider';
import { useFeatureToggleProvider } from '../featureToggle/FeatureToggleProvider';
import { ViewStateProvider } from './ViewState';
import { useDialogStore } from './dialogProvider/dialogStore';
import { useShallow } from 'zustand/react/shallow';

export const FNRContext = React.createContext<string | undefined>(undefined);
export const useFnrContext = () => useContext(FNRContext);
export const useErVeileder = () => useContext(FNRContext) !== undefined;

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
    const { fnr, children, visAktivitetDefault } = props;
    const { data: feature, status: featureStatus } = useFeatureToggleProvider();
    const { data: bruker, status: brukerstatus }: BrukerDataProviderType = useBrukerDataProvider();
    const dialogDataProvider = useDialogDataProvider();

    const { configurePoll, stopPolling, dialogstatus } = useDialogStore(
        useShallow((store) => ({
            configurePoll: store.configurePoll,
            stopPolling: store.stopPolling,
            dialogstatus: store.status
        }))
    );

    useEffect(() => {
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

    // if (isDialogPending(dialogstatus) || isPending(brukerstatus) || isPending(oppfolgingstatus)) {
    //     return (
    //         <div className="flex flex-1 justify-center self-center">
    //             <Loader size="3xlarge" />
    //         </div>
    //     );
    // } else if (hasError(brukerstatus) || hasError(oppfolgingstatus) || hasDialogError(dialogstatus)) {
    //     if (hasError(brukerstatus)) {
    //         return <Alert variant="error">Kunne ikke hente brukerinfo. Prøv igjen senere.</Alert>;
    //     }
    //     if (hasError(oppfolgingstatus)) {
    //         return <Alert variant="error">Kunne ikke hente oppfølgingstatus. Prøv igjen senere.</Alert>;
    //     }
    //     return <Alert variant="error">Kunne ikke hente dialoger. Prøv igjen senere.</Alert>;
    // }

    return (
        <DialogContext.Provider value={dialogDataProvider}>
            <FNRContext.Provider value={fnr}>
                <ViewStateProvider>
                    <AktivitetToggleProvider defaultValue={visAktivitetDefault || false}>
                        {children}
                    </AktivitetToggleProvider>
                </ViewStateProvider>
            </FNRContext.Provider>
        </DialogContext.Provider>
    );
}
