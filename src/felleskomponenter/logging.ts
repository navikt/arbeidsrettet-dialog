import { logAnalyticsEvent } from '../metrics/initAnalytics';

export default function loggEvent(eventNavn: string, feltObjekt?: object, tagObjekt?: object) {
    logAnalyticsEvent(eventNavn, { ...feltObjekt, ...tagObjekt });
}
