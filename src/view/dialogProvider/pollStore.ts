import { DialogApi } from '../../api/UseApiBasePath';
import { closeWebsocket, listenForNyDialogEvents } from '../../api/nyDialogWs';
import { fetchData, fnrQuery } from '../../utils/Fetch';
import { SistOppdatert } from '../../utils/Typer';
import { DialogStore } from './dialogStore';
import { isAfter } from 'date-fns';

export interface PollSlice {
    pollForChanges: (fnr: string | undefined) => Promise<void>;
    configurePoll(config: { fnr: string | undefined; useWebsockets: boolean; erBruker: boolean }): void;
    stopPolling: () => void;
}

export const pollSlice = (
    set: (setter: (prev: DialogStore) => DialogStore, dontKnow: boolean, actionName: string) => void,
    get: () => DialogStore
): PollSlice => ({
    configurePoll({ fnr, useWebsockets, erBruker }) {
        console.log('Configuring poll');
        const { pollForChanges, currentPollFnr } = get();
        // If already polling, don't do anything
        if (!erBruker && currentPollFnr == fnr) {
            return;
        }
        const pollOnGivenFnr = () => {
            const interval = onIntervalWithCleanup(() => pollForChanges(fnr));
            set(
                (prev: DialogStore) => ({
                    ...prev,
                    pollInterval: interval,
                    currentPollFnr: fnr
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
                    return listenForNyDialogEvents(() => silentlyHentDialoger(fnr), fnr);
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
                (prev) => ({
                    ...prev,
                    pollInterval: undefined
                }),
                false,
                'clearPollInterval'
            );
        }
        closeWebsocket();
    },
    pollForChanges: async (fnr) => {
        let { sistOppdatert: remoteSistOppdatert } = await fetchData<SistOppdatert>(
            DialogApi.sistOppdatert(fnrQuery(fnr))
        );
        const {
            silentlyHentDialoger,
            hentDialog: {
                data: { sistOppdatert: localSistOppdatert }
            }
        } = get();
        if (!!remoteSistOppdatert && isAfter(remoteSistOppdatert, localSistOppdatert)) {
            await silentlyHentDialoger(fnr);
        }
    }
});

const onIntervalWithCleanup = (pollForChanges: () => Promise<void>) => {
    return;
    let interval: NodeJS.Timeout;
    console.log('Setting up polling with http');
    interval = setInterval(() => {
        pollForChanges().catch((e) => {
            console.error(e);
            clearInterval(interval);
        });
    }, 2000);
    return interval;
};
