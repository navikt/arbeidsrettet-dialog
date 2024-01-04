import { create } from 'zustand';
import { Status } from '../../api/typer';
import { DialogData } from '../../utils/Typer';
import { fetchData, fnrQuery } from '../../utils/Fetch';
import { DialogApi } from '../../api/UseApiBasePath';
import { devtools } from 'zustand/middleware';
import {
    HentDialogRequestState,
    RequestStateWithoutPayload,
    asyncThunk,
    requestHelpers,
    sliceReducer
} from './storeUtils';
import { PollSlice, pollSlice } from './pollStore';
import { ferdigBehandletUrl, lesUrl, venterPaSvarUrl } from '../DialogProvider';

export const initDialogState: DialogRequestStore = {
    hentDialog: {
        status: Status.INITIAL,
        data: { dialoger: [], sistOppdatert: new Date() },
        error: undefined
    },
    lesDialogState: {
        status: Status.INITIAL,
        data: undefined,
        error: undefined
    },
    setFerdigBehandletState: {
        status: Status.INITIAL,
        data: undefined,
        error: undefined
    },
    setVenterPaSvarState: {
        status: Status.INITIAL,
        data: undefined,
        error: undefined
    }
};

// - Les
// - Set ferdig
// - Hent dialoger
// - Send melding
// - Ny dialog

// State as in not actions
export interface DialogRequestStore {
    hentDialog: HentDialogRequestState;
    lesDialogState: RequestStateWithoutPayload;
    setFerdigBehandletState: RequestStateWithoutPayload;
    setVenterPaSvarState: RequestStateWithoutPayload;
}

export type DialogStore = DialogRequestStore &
    PollSlice & {
        silentlyHentDialoger: (
            fnr: string | undefined
        ) => Promise<{ dialoger: DialogData[]; sistOppdatert: Date | undefined }>;
        hentDialoger: (fnr: string | undefined) => Promise<void>;
        lesDialog: (id: string, fnr: string | undefined) => Promise<DialogData>;
        updateDialogInDialoger: (dialogData: DialogData) => DialogData;
        setFerdigBehandlet: (args: FerdigBehandletPayload) => Promise<DialogData>;
        setVenterPaSvar: (args: VenterPaSvarPayload) => Promise<DialogData>;
        pollInterval: NodeJS.Timeout | undefined;
        currentPollFnr: string | undefined;
    };

export const useDialogStore = create(
    devtools<DialogStore>(
        (set, get) => ({
            ...pollSlice(set, get),
            // Data
            // Try to keeep flat datastructure, Zustand "automerges" state on first level only
            ...initDialogState,
            pollInterval: undefined,
            currentPollFnr: undefined,
            // Actions / functions / mutations
            silentlyHentDialoger: async (fnr) => {
                return hentDialogerKall(fnr).then((data) => {
                    set((prev: DialogStore) => ({
                        ...prev,
                        hentDialog: {
                            error: undefined,
                            data,
                            status: Status.OK
                        }
                    }));
                    return data;
                });
            },
            hentDialoger: async (fnr) => {
                const reducer = sliceReducer(set, 'hentDialog');
                asyncThunk(reducer, () => hentDialogerKall(fnr), 'hentDialoger');
            },
            lesDialog: async (id: string, fnr: string | undefined) => {
                // const reducer = sliceReducer(set, 'lesDialogState');
                const { pendingState, fulfilledState } = requestHelpers({
                    prefix: 'lesDialog',
                    sliceName: 'lesDialogState'
                });
                set(pendingState(), false, 'lesDialog/pending');
                const res = fetchData<DialogData>(lesUrl({ id, fnr }), { method: 'put' });
                set(fulfilledState(res), false, 'lesDialog/fulfilled');
                return res;

                // return asyncThunk<DialogData, unknown>(
                //     reducer,
                //     () => fetchData<DialogData>(lesUrl({ id, fnr }), { method: 'put' }),
                //     'lesDialog'
                // ).then((dialog) => {
                //     set(updateDialogReducer(dialog));
                //     return dialog;
                // });
            },
            setFerdigBehandlet: async ({ id, ferdigBehandlet, fnr }: FerdigBehandletPayload) => {
                const reducer = sliceReducer(set, 'setFerdigBehandletState');
                const { updateDialogInDialoger } = get();
                return asyncThunk(
                    reducer,
                    () =>
                        fetchData<DialogData>(ferdigBehandletUrl({ id, ferdigBehandlet, fnr }), {
                            method: 'put'
                        }),
                    'setFerdigBehandlet'
                ).then((dialogData) => updateDialogInDialoger(dialogData));
            },
            setVenterPaSvar: async ({ id, venterPaSvar, fnr }: VenterPaSvarPayload) => {
                const reducer = sliceReducer(set, 'setVenterPaSvarState');
                const { updateDialogInDialoger } = get();
                return asyncThunk(
                    reducer,
                    () =>
                        fetchData<DialogData>(venterPaSvarUrl({ id, venterPaSvar, fnr }), {
                            method: 'put'
                        }),
                    'setVenterPaSvar'
                ).then((dialogData) => updateDialogInDialoger(dialogData));
            },
            updateDialogInDialoger: (dialog: DialogData): DialogData => {
                set(updateDialogReducer(dialog), false, 'updateDialogInDialoger');
                return dialog;
            }
        }),
        { name: 'DialogStore' }
    )
);

const updateDialogReducer = (dialog: DialogData) => (prevState: DialogStore) => {
    const dialoger = prevState.hentDialog.data.dialoger;
    const index = dialoger.findIndex((d) => d.id === dialog.id);
    const nyeDialoger = [...dialoger.slice(0, index), dialog, ...dialoger.slice(index + 1, dialoger.length)];
    return {
        ...prevState,
        hentDialog: {
            ...prevState.hentDialog,
            status: Status.OK,
            data: { dialoger: nyeDialoger, sistOppdatert: new Date() },
            error: undefined
        }
    };
};

const hentDialogerKall = (fnr: string | undefined) => {
    const dialogUrl = DialogApi.hentDialog(fnrQuery(fnr));
    return fetchData<DialogData[]>(dialogUrl).then((dialoger) => {
        // TODO: Find a way to get previous value
        // loggChangeInDialog(state.dialoger, dialoger);
        return { dialoger, sistOppdatert: new Date() };
    });
};

export interface VenterPaSvarPayload {
    id: string;
    venterPaSvar: boolean;
    fnr: string | undefined;
}
export interface FerdigBehandletPayload {
    id: string;
    ferdigBehandlet: boolean;
    fnr: string | undefined;
}
