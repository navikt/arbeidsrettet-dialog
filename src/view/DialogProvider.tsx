import React, { useCallback, useContext, useMemo, useState } from 'react';
import { DialogData } from '../utils/Typer';
import { fetchData, fnrQuery, getApiBasePath } from '../utils/Fetch';

enum Status {
    INITIAL,
    PENDING,
    RELOADING,
    OK,
    ERROR
}

export interface DialogDataProviderType {
    status: Status;
    dialoger: DialogData[];
    hentDialoger: () => Promise<DialogData[]>;
    nyDialog: (melding: string, tema: string, aktivitetId?: string) => Promise<DialogData>;
    nyHenvendelse: (melding: string, dialog: DialogData) => Promise<DialogData>;
    lesDialog: (dialog: DialogData) => Promise<DialogData>;
    setFerdigBehandlet: (dialog: DialogData, ferdigBehandlet: boolean) => Promise<DialogData>;
    setVenterPaSvar: (dialog: DialogData, venterPaSvar: boolean) => Promise<DialogData>;
}

export const DialogContext = React.createContext<DialogDataProviderType>({
    status: Status.INITIAL,
    dialoger: [],
    hentDialoger: () => Promise.resolve([]),
    nyDialog: (melding: string, tema: string, aktivitetId?: string) => Promise.resolve({} as any),
    nyHenvendelse: (melding: string, dialog: DialogData) => Promise.resolve(dialog),
    lesDialog: (dialog: DialogData) => Promise.resolve(dialog),
    setFerdigBehandlet: (dialog: DialogData, ferdigBehandlet: boolean) => Promise.resolve(dialog),
    setVenterPaSvar: (dialog: DialogData, venterPaSvar: boolean) => Promise.resolve(dialog)
});

export const useDialogContext = () => useContext(DialogContext);

export interface DialogState {
    status: Status;
    dialoger: DialogData[];
}

const initDialogState: DialogState = {
    status: Status.INITIAL,
    dialoger: []
};

export function useDialogDataProvider(fnr?: string): DialogDataProviderType {
    const [state, setState] = useState(initDialogState);

    const apiBasePath = getApiBasePath(fnr);
    const query = fnrQuery(fnr);

    const baseUrl = useMemo(() => `${apiBasePath}/veilarbdialog/api/dialog${query}`, [apiBasePath, query]);
    const lesUrl = useCallback((id: string) => `${apiBasePath}/veilarbdialog/api/dialog/${id}/les${query}`, [
        apiBasePath,
        query
    ]);
    const ferdigBehandletUrl = useCallback(
        (id: string, ferdigBehandlet: boolean) =>
            `${apiBasePath}/veilarbdialog/api/dialog/${id}/ferdigbehandlet/${ferdigBehandlet}${query}`,
        [apiBasePath, query]
    );
    const venterPaSvarUrl = useCallback(
        (id: string, venterPaSvar: boolean) =>
            `${apiBasePath}/veilarbdialog/api/dialog/${id}/venter_pa_svar/${venterPaSvar}${query}`,
        [apiBasePath, query]
    );

    const hentDialoger = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            status: isDialogReloading(prevState.status) ? Status.RELOADING : Status.PENDING
        }));
        return fetchData<DialogData[]>(baseUrl)
            .then(dialoger => {
                setState({ status: Status.OK, dialoger: dialoger });
                return dialoger;
            })
            .catch(() => {
                setState(prevState => ({ ...prevState, status: Status.ERROR }));
                return [];
            });
    }, [baseUrl, setState]);

    const updateDialogInDialoger = useCallback(
        (dialog: DialogData) => {
            setState(prevState => {
                const dialoger = prevState.dialoger;
                const index = dialoger.findIndex(d => d.id === dialog.id);
                const nyeDialoger = [
                    ...dialoger.slice(0, index),
                    dialog,
                    ...dialoger.slice(index + 1, dialoger.length)
                ];
                return { status: Status.OK, dialoger: nyeDialoger };
            });
            return dialog;
        },
        [setState]
    );

    const sendMelding = useCallback(
        (melding: string, tema?: string, dialogId?: string, aktivitetId?: string) => {
            setState(prevState => ({ ...prevState, status: Status.RELOADING }));

            const nyDialogData = {
                dialogId: dialogId,
                overskrift: tema,
                tekst: melding,
                aktivitetId: aktivitetId
            };

            return fetchData<DialogData>(baseUrl, {
                method: 'post',
                body: JSON.stringify(nyDialogData)
            }).then(dialog => {
                if (!!dialogId) {
                    updateDialogInDialoger(dialog);
                    return dialog;
                }
                setState(prevState => ({ status: Status.OK, dialoger: [...prevState.dialoger, dialog] }));
                return dialog;
            });
        },
        [setState, baseUrl, updateDialogInDialoger]
    );

    const nyDialog = useCallback(
        (melding: string, tema: string, aktivitetId?: string) => {
            return sendMelding(melding, tema, undefined, aktivitetId);
        },
        [sendMelding]
    );

    const nyHenvendelse = useCallback(
        (melding: string, dialog: DialogData) => {
            return sendMelding(melding, undefined, dialog.id);
        },
        [sendMelding]
    );

    const lesDialog = useCallback(
        (dialog: DialogData) => {
            setState(prevState => ({ ...prevState, status: Status.RELOADING }));
            return fetchData<DialogData>(lesUrl(dialog.id), { method: 'put' }).then(updateDialogInDialoger);
        },
        [setState, lesUrl, updateDialogInDialoger]
    );

    const setFerdigBehandlet = useCallback(
        (dialog: DialogData, ferdigBehandlet: boolean) => {
            setState(prevState => ({ ...prevState, status: Status.RELOADING }));
            return fetchData<DialogData>(ferdigBehandletUrl(dialog.id, ferdigBehandlet), { method: 'put' }).then(
                updateDialogInDialoger
            );
        },
        [setState, ferdigBehandletUrl, updateDialogInDialoger]
    );

    const setVenterPaSvar = useCallback(
        (dialog: DialogData, venterPaSvar: boolean) => {
            setState(prevState => ({ ...prevState, status: Status.RELOADING }));
            return fetchData<DialogData>(venterPaSvarUrl(dialog.id, venterPaSvar), { method: 'put' }).then(
                updateDialogInDialoger
            );
        },
        [setState, venterPaSvarUrl, updateDialogInDialoger]
    );

    return useMemo(() => {
        return {
            status: state.status,
            dialoger: state.dialoger,
            hentDialoger,
            nyDialog,
            nyHenvendelse,
            lesDialog,
            setFerdigBehandlet,
            setVenterPaSvar
        };
    }, [state, hentDialoger, nyDialog, nyHenvendelse, lesDialog, setFerdigBehandlet, setVenterPaSvar]);
}

function isDialogReloading(status: Status) {
    return status === Status.OK || status === Status.RELOADING;
}

export function isDialogPending(status: Status) {
    return status === Status.PENDING;
}

export function isDialogPendingOrReloading(status: Status) {
    return status === Status.PENDING || status === Status.RELOADING;
}

export function hasDialogError(status: Status) {
    return status === Status.ERROR;
}