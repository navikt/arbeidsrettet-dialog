import React, { useContext } from 'react';

import { Status } from '../api/typer';
import { DialogApi } from '../api/UseApiBasePath';
import { fetchData } from '../utils/Fetch';
import { DialogData } from '../utils/Typer';
import { useDialogStore } from './dialogProvider/dialogStore';
import { useShallow } from 'zustand/react/shallow';

export const DialogContext = React.createContext<DialogDataProviderType>({
    status: Status.INITIAL,
    nyDialog: (args) => Promise.resolve({} as any),
    nyMelding: ({ dialog }: NyMeldingArgs) => Promise.resolve(dialog),
    lesDialog: (_dialogId: string) => Promise.resolve({} as any),
    setFerdigBehandlet: (dialog: DialogData, _ferdigBehandlet: boolean) => Promise.resolve(dialog),
    setVenterPaSvar: (dialog: DialogData, _venterPaSvar: boolean) => Promise.resolve(dialog),
});

export const useDialogContext = () => useContext(DialogContext);
export const useDialoger = () => useDialogStore((state) => state.dialoger);

export interface NyTradArgs {
    melding: string;
    tema: string;
    aktivitetId: string | undefined;
    fnr: string | undefined;
    venterPaaSvarFraBruker: boolean;
}
export interface NyMeldingArgs {
    melding: string;
    dialog: DialogData;
    fnr: string | undefined;
}
export interface SendMeldingArgs {
    tekst: string;
    overskrift?: string;
    dialogId?: string;
    aktivitetId?: string;
    fnr?: string;
}

export interface DialogDataProviderType {
    status: Status;
    nyDialog: (args: NyTradArgs) => Promise<DialogData | undefined>;
    nyMelding: (args: NyMeldingArgs) => Promise<DialogData | undefined>;
    lesDialog: (dialogId: string, fnr: string | undefined) => Promise<DialogData>;
    setFerdigBehandlet: (dialog: DialogData, ferdigBehandlet: boolean) => Promise<DialogData>;
    setVenterPaSvar: (dialog: DialogData, venterPaSvar: boolean) => Promise<DialogData>;
}

export interface DialogState {
    isSessionExpired: boolean;
    status: Status;
    sistOppdatert: Date;
    dialoger: DialogData[];
    error?: string;
}

const lesUrl = ({ id }: { id: string }) => DialogApi.settLest(id);
const ferdigBehandletUrl = ({ ferdigBehandlet, id }: { id: string; ferdigBehandlet: boolean }) =>
    DialogApi.ferdigBehandlet(id, ferdigBehandlet);
const venterPaSvarUrl = ({ id, venterPaSvar }: { id: string; venterPaSvar: boolean }) =>
    DialogApi.venterPaSvar(id, venterPaSvar);

export function useDialogDataProvider(): DialogDataProviderType {
    const { updateDialogInDialoger, setStatus, nyDialog, nyMelding } = useDialogStore(
        useShallow((state) => ({
            updateDialogInDialoger: state.updateDialogInDialoger,
            updateDialogWithNewDialog: state.updateDialogWithNewDialog,
            setStatus: state.setStatus,
            sendMelding: state.sendMelding,
            nyDialog: state.nyDialog,
            nyMelding: state.nyMelding,
        })),
    );
    const status = useDialogStore(useShallow((store) => store.status));

    const lesDialog = (dialogId: string) => {
        setStatus(Status.RELOADING, 'lesDialog/pending');
        return fetchData<DialogData>(lesUrl({ id: dialogId }), { method: 'put' }).then((dialogData) => {
            setStatus(Status.OK);
            return updateDialogInDialoger(dialogData);
        });
    };

    const setFerdigBehandlet = (dialog: DialogData, ferdigBehandlet: boolean) => {
        setStatus(Status.RELOADING, 'setFerdigBehandlet/pending');
        return fetchData<DialogData>(ferdigBehandletUrl({ id: dialog.id, ferdigBehandlet }), {
            method: 'put',
        }).then((dialogData) => {
            setStatus(Status.OK);
            return updateDialogInDialoger(dialogData);
        });
    };

    const setVenterPaSvar = (dialog: DialogData, venterPaSvar: boolean) => {
        setStatus(Status.RELOADING, 'setVenterPaSvar/pending');
        return fetchData<DialogData>(venterPaSvarUrl({ id: dialog.id, venterPaSvar }), { method: 'put' }).then(
            (dialogData) => {
                setStatus(Status.OK);
                return updateDialogInDialoger(dialogData);
            },
        );
    };

    return {
        status,
        nyDialog,
        nyMelding,
        lesDialog,
        setFerdigBehandlet,
        setVenterPaSvar,
    };
}

export function isDialogReloading(status: Status) {
    return status === Status.OK || status === Status.RELOADING;
}

export function isDialogPending(status: Status) {
    return status === Status.PENDING;
}

export function hasDialogError(status: Status) {
    return status === Status.ERROR;
}
