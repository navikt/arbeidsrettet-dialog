import * as amplitude from '@amplitude/analytics-browser';
import { track } from '@amplitude/analytics-browser';

export function initAmplitude() {
    const apiKey = import.meta.env.VITE_AMPLITUDE_KEY ?? 'default';
    amplitude.init(apiKey, undefined, {
        serverUrl: import.meta.env.VITE_AMPLITUDE_API_URL,
        ingestionMetadata: {
            sourceName: window.location.toString(),
        },
    });
}

export const amplitudeTrack = track;
