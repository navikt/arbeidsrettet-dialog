import { Env, getEnv } from '../utils/envUtil';
import { APP_NAME, erEksternFlate, TEAM_NAME } from '../constants';

type EventDataValue = string | boolean | number | null | undefined;
type TrackingFunction = (eventName: string, eventData: Record<string, EventDataValue>) => void;
let trackingFunction: TrackingFunction = () => {};

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
        const dekoratorenTracking = window.dekoratorenAnalytics;
        console.log('dekoratorenTracking', dekoratorenTracking);
        trackingFunction = (eventName, eventData) => {
            return dekoratorenTracking({ origin: 'arbeidsrettet-dialog', eventName, eventData });
        };
    } else {
        import('./amplitude-utils').then((module) => {
            module.initAmplitude();
            trackingFunction = module.amplitudeTrack;
        });
    }
};

export const logAnalyticsEvent = (eventName: string, data?: { [key: string]: EventDataValue }) => {
    const dataWithDefaults = {
        app: APP_NAME,
        team: TEAM_NAME,
        ...(data || {}),
    };
    try {
        trackingFunction(eventName, dataWithDefaults);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Kunne ikke sende analytics event:', error);
    }
};

export const loggKlikkVisAktivitet = (enabledAfterClick: boolean) => {
    logAnalyticsEvent('toggle', { text: 'Vis aktivitet', enabledAfterClick });
};
