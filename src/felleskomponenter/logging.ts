import { DialogApi } from '../api/UseApiBasePath';
import { DialogData } from '../utils/Typer';
import { captureMessage } from '@sentry/react';
import { logAnalyticsEvent } from '../metrics/initAnalytics';

interface FrontendEvent {
    name: string;
    fields?: {};
    tags?: {};
}
const url = DialogApi.logg;
export default function loggEvent(eventNavn: string, feltObjekt?: object, tagObjekt?: object) {
    const event: FrontendEvent = { name: eventNavn, fields: feltObjekt, tags: tagObjekt };
    const config = {
        headers: {
            'Nav-Consumer-Id': 'arbeidsrettet-dialog',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin' as const,
        method: 'post',
        body: JSON.stringify(event),
    };
    logAnalyticsEvent(eventNavn, { ...feltObjekt, ...tagObjekt });
    fetch(url, config).catch((e: Error) => {
        captureMessage(`Klarte ikke logge event ${e.toString()}`);
    });
}

// TODO remove me in the future
export function loggChangeInDialog(gamelDialoger: DialogData[], nyeDialoger: DialogData[]) {
    if (gamelDialoger.length !== nyeDialoger.length) {
        loggEvent('arbeidsrettet-dialog.polling.ny-dialog');
        return;
    }

    const oldHenv = gamelDialoger.reduce((prevValue, currentValue) => prevValue + currentValue.henvendelser.length, 0);
    const newHenv = nyeDialoger.reduce((prevValue, currentValue) => prevValue + currentValue.henvendelser.length, 0);

    if (oldHenv !== newHenv) {
        loggEvent('arbeidsrettet-dialog.polling.ny-henvendelse');
    }
}
