import { create } from 'zustand';
import { Status } from '../../api/typer';
import { DialogData, KladdData, NyDialogMeldingData, SistOppdatert } from '../../utils/Typer';
import { DialogState, isDialogReloading, NyMeldingArgs, NyTradArgs, SendMeldingArgs } from '../DialogProvider';
import { fetchData } from '../../utils/Fetch';
import { DialogApi } from '../../api/UseApiBasePath';
import { isAfter } from 'date-fns';
import { devtools } from 'zustand/middleware';
import { EventType, closeWebsocket, listenForNyDialogEvents } from '../../api/nyDialogWs';
import { useShallow } from 'zustand/react/shallow';
import { hentDialogerGraphql } from './dialogGraphql';
import { eqKladd, KladdStore } from '../KladdProvider';
import { UnautorizedError } from '../../utils/fetchErrors';

export const initDialogState: DialogState = {
    status: Status.INITIAL,
    sistOppdatert: new Date(),
    dialoger: []
};

type DialogStore = DialogState &
    KladdStore & {
        kladder: KladdData[];
        silentlyHentDialoger: (fnr: string | undefined) => Promise<DialogData[]>;
        hentDialoger: (fnr: string | undefined) => Promise<DialogData[]>;
        pollForChanges: (fnr: string | undefined) => Promise<void>;
        configurePoll(config: { fnr: string | undefined; useWebsockets: boolean; erBruker: boolean }): void;
        updateDialogInDialoger: (dialogData: DialogData) => DialogData;
        updateDialogWithNewDialog: (dialogData: DialogData) => DialogData;
        stopPolling: () => void;
        setStatus: (status: Status, actionName?: string) => void;
        pollInterval: NodeJS.Timeout | undefined;
        currentPollFnr: string | undefined;
        nyDialog: (melding: NyTradArgs) => Promise<DialogData | undefined>;
        nyMelding: (melding: NyMeldingArgs) => Promise<DialogData | undefined>;
        sendMelding: (melding: NyDialogMeldingData) => Promise<DialogData | undefined>;
    };

export const useDialogStore = create(
    devtools<DialogStore>(
        (set, get) => ({
            // Data
            // Try to keeep flat datastructure, Zustand "automerges" state on first level only
            ...initDialogState,
            pollInterval: undefined,
            currentPollFnr: undefined,
            kladder: [] as KladdData[],
            kladdStatus: Status.INITIAL,
            // Actions / functions / mutations
            silentlyHentDialoger: async (fnr) => {
                return hentDialogerGraphql(fnr)
                    .then(({ dialoger, kladder }) => {
                        // TODO: Find a way to get previous value
                        // loggChangeInDialog(state.dialoger, dialoger);
                        set(
                            { status: Status.OK, dialoger, sistOppdatert: new Date(), error: undefined, kladder },
                            false, // flag for overwriting state, default false but needs to be provided when naming actions
                            'hentDialoger/fulfilled'
                        );
                        return dialoger;
                    })
                    .catch((e) => {
                        console.error(e);
                        set(
                            (prevState) => ({ ...prevState, status: Status.ERROR, error: e }),
                            false,
                            'hentDialoger/error'
                        );
                        return [] as unknown as DialogData[];
                    });
            },
            hentDialoger: async (fnr) => {
                set(
                    (state) => ({
                        status: isDialogReloading(state.status) ? Status.RELOADING : Status.PENDING,
                        error: undefined
                    }),
                    false,
                    'hentDialoger/pending'
                );
                const { silentlyHentDialoger } = get();
                return silentlyHentDialoger(fnr);
            },
            configurePoll({ fnr, useWebsockets, erBruker }) {
                const { pollForChanges, currentPollFnr } = get();
                // If already polling, don't do anything
                if (!erBruker && currentPollFnr == fnr) {
                    console.log('Already polling');
                    return;
                }
                const pollOnGivenFnr = () => {
                    const interval = onIntervalWithCleanup(() => pollForChanges(fnr));
                    set(
                        () => ({
                            pollInterval: interval
                        }),
                        false,
                        'setPollInterval'
                    );
                };
                if (erBruker) {
                    return pollOnGivenFnr();
                } else {
                    if (useWebsockets) {
                        try {
                            const { silentlyHentDialoger } = get();
                            return listenForNyDialogEvents(() => silentlyHentDialoger(fnr), fnr, [
                                EventType.NY_DIALOGMELDING_FRA_BRUKER_TIL_NAV
                            ]);
                        } catch (e) {
                            // Fallback to http-polling if anything fails
                            return pollOnGivenFnr();
                        }
                    } else {
                        return pollOnGivenFnr();
                    }
                }
            },
            stopPolling: () => {
                const { pollInterval } = get();
                console.log('Stopping polling with http');
                if (pollInterval) {
                    clearInterval(pollInterval);
                    set(
                        () => ({
                            pollInterval: undefined
                        }),
                        false,
                        'clearPollInterval'
                    );
                }
                closeWebsocket();
            },
            pollForChanges: async (fnr) => {
                try {
                    let { sistOppdatert: remoteSistOppdatert } = await fetchData<SistOppdatert>(
                        DialogApi.sistOppdatert,
                        {
                            method: 'POST',
                            body: !fnr ? undefined : JSON.stringify({ fnr })
                        }
                    );
                    const { silentlyHentDialoger, sistOppdatert: localSistOppdatert } = get();
                    if (!!remoteSistOppdatert && isAfter(remoteSistOppdatert, localSistOppdatert)) {
                        await silentlyHentDialoger(fnr);
                    }
                } catch (e) {
                    if (e instanceof UnautorizedError) {
                    } else {
                        console.warn('Kunne ikke hent sist oppdatert');
                    }
                }
            },
            setStatus: (status: Status, actionName: string = 'dialogStore/setStatus') => {
                set({ status }, false, actionName);
            },
            updateDialogInDialoger: (dialog: DialogData): DialogData => {
                set(
                    ({ dialoger }) => {
                        const index = dialoger.findIndex((d) => d.id === dialog.id);
                        const nyeDialoger = [
                            ...dialoger.slice(0, index),
                            dialog,
                            ...dialoger.slice(index + 1, dialoger.length)
                        ];
                        return { status: Status.OK, dialoger: nyeDialoger, error: undefined };
                    },
                    false,
                    'updateDialogInDialoger'
                );
                return dialog;
            },
            nyDialog: ({ melding, aktivitetId, fnr, tema }: NyTradArgs) => {
                const { sendMelding } = get();
                return sendMelding({ tekst: melding, overskrift: tema, dialogId: undefined, aktivitetId, fnr });
            },
            nyMelding: ({ melding, dialog, fnr }: NyMeldingArgs) => {
                const { sendMelding } = get();
                return sendMelding({ tekst: melding, dialogId: dialog.id, fnr });
            },
            sendMelding: async (nyDialogData: SendMeldingArgs) => {
                set({ status: Status.RELOADING }, false, 'sendMelding/pending');
                return fetchData<DialogData>(DialogApi.opprettDialog, {
                    method: 'POST',
                    body: JSON.stringify(nyDialogData)
                })
                    .then((dialog) => {
                        const { updateDialogInDialoger, updateDialogWithNewDialog } = get();
                        if (!nyDialogData.dialogId) {
                            updateDialogInDialoger(dialog);
                        } else {
                            updateDialogWithNewDialog(dialog);
                        }
                        set({ status: Status.OK }, false, 'sendMelding/fulfilled');
                        return dialog;
                    })
                    .catch((err) => {
                        console.error('Kunne ikke sende melding', err);
                        set({ status: Status.ERROR }, false, 'sendMelding/rejected');
                        return undefined;
                    });
            },
            updateDialogWithNewDialog: (dialogData: DialogData) => {
                set(
                    ({ dialoger }) => {
                        return {
                            dialoger: [...dialoger, dialogData],
                            status: Status.OK,
                            error: undefined
                        };
                    },
                    false,
                    'dialogStore/newDialogThread'
                );
                return dialogData;
            },
            oppdaterKladd: (kladd: KladdData & { fnr: string | undefined }) => {
                set(
                    ({ kladder }) => {
                        const { dialogId, aktivitetId } = kladd;
                        const nyKladder = [...kladder.filter((k) => !eqKladd(k, dialogId, aktivitetId)), kladd];
                        return { kladdStatus: Status.RELOADING, kladder: nyKladder };
                    },
                    false,
                    'oppdaterKladd/pending'
                );
                fetchData<void>(DialogApi.kladd, {
                    method: 'post',
                    body: JSON.stringify({ ...kladd })
                })
                    .then(() => set({ kladdStatus: Status.OK }, false, 'oppdaterKladd/fulfilled'))
                    .catch(() => set({ kladdStatus: Status.OK }, false, 'oppdaterKladd/rejected'));
            },
            slettKladd: (dialogId, aktivitetId) => {
                set(
                    ({ kladder }) => {
                        const ny = kladder.filter((k) => !eqKladd(k, dialogId, aktivitetId));
                        return { kladder: ny };
                    },
                    false,
                    'oppdaterKladd/delete'
                );
            }
        }),
        { name: 'DialogStore' }
    )
);

export const useHentDialoger = () => useDialogStore(useShallow((store) => store.hentDialoger));
export const useSilentlyHentDialoger = () => useDialogStore(useShallow((store) => store.silentlyHentDialoger));

const onIntervalWithCleanup = (pollForChanges: () => Promise<void>) => {
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
        pollForChanges().catch((e) => {
            console.error(e);
            clearInterval(interval);
        });
    }, 10000);
    return interval;
};
