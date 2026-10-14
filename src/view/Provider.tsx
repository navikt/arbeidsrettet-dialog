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
export const ErVeilederContext = React.createContext<boolean>(false);
export const useFnrContext = () => useContext(FNRContext);
export const useErVeileder = () => useContext(ErVeilederContext);

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
            dialogstatus: store.status,
        })),
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
            useWebsockets: feature['arbeidsrettet-dialog.websockets'],
        });
    }, [klarTilAaPolle, fnr]);

    return (
        <DialogContext.Provider value={dialogDataProvider}>
            <ErVeilederContext.Provider value={props.erVeileder}>
                <FNRContext.Provider value={fnr}>
                    <ViewStateProvider>
                        <AktivitetToggleProvider defaultValue={visAktivitetDefault || false}>
                            {children}
                        </AktivitetToggleProvider>
                    </ViewStateProvider>
                </FNRContext.Provider>
            </ErVeilederContext.Provider>
        </DialogContext.Provider>
    );
}
