import { Env, getEnv } from '../utils/envUtil';
import { APP_NAME, erEksternFlate, TEAM_NAME } from '../constants';
import { startWaitingForUmamiToAppearOnWindow, umamiTrack } from './umamiFromScript';

type EventDataValue = string | boolean | number | null | undefined;
type TrackingFunction = (eventName: string, eventData: Record<string, EventDataValue>) => void;

type QueuedEvent = {
    eventName: string;
    eventData: Record<string, EventDataValue>;
};

let trackingFunction: TrackingFunction = () => {};
let eventQueue: QueuedEvent[] = [];
let isInitialized = false;

// Generator function to process events from the queue
function* eventQueueProcessor(): Generator<QueuedEvent, void, void> {
    while (eventQueue.length > 0) {
        const event = eventQueue.shift();
        if (event) {
            yield event;
        }
    }
}

// Process all queued events once tracking is initialized
const flushEventQueue = () => {
    const processor = eventQueueProcessor();
    let result: IteratorResult<QueuedEvent> = processor.next();
    while (!result.done) {
        trackingFunction(result.value.eventName, result.value.eventData);
        result = processor.next();
    }
};

// Queue or immediately track events
const queueOrTrackEvent = (eventName: string, eventData: Record<string, EventDataValue>) => {
    if (isInitialized) {
        trackingFunction(eventName, eventData);
    } else {
        eventQueue.push({ eventName, eventData });
    }
};

declare global {
    interface Window {
        dekoratorenAnalytics: (arg: {
            origin: string;
            eventName: string;
            eventData: Record<string, EventDataValue>;
        }) => Promise<void>;
    }
}

const env = getEnv();

export const initAnalytics = () => {
    if (env == Env.Local) return;
    if (erEksternFlate) {
        /* window.dekoratorenAnalytics does not return a function instantly, have to wait for it to be ready */
        setTimeout(() => {
            const dekoratorenTracking = window.dekoratorenAnalytics;
            trackingFunction = (eventName, eventData) => {
                dekoratorenTracking({ origin: 'arbeidsrettet-dialog', eventName, eventData });
            };
            isInitialized = true;
            flushEventQueue();
        }, 1000);
    } else {
        startWaitingForUmamiToAppearOnWindow();
        trackingFunction = umamiTrack;
        isInitialized = true;
        flushEventQueue();
    }
};

export const logAnalyticsEvent = (eventName: string, data?: { [key: string]: EventDataValue }) => {
    const dataWithDefaults = {
        app: APP_NAME,
        team: TEAM_NAME,
        ...(data || {}),
    };
    try {
        queueOrTrackEvent(eventName, dataWithDefaults);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Kunne ikke sende analytics event:', error);
    }
};

export const loggKlikkVisAktivitet = (enabledAfterClick: boolean) => {
    logAnalyticsEvent('toggle', { text: 'Vis aktivitet', enabledAfterClick });
};
