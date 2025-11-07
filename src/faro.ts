import { initializeFaro } from '@grafana/faro-web-sdk';
import { Env, getEnv } from './utils/envUtil';

const endpoint = {
    [Env.Prod]: 'https://telemetry.nav.no/collect',
    [Env.Dev]: 'https://telemetry.ekstern.dev.nav.no/collect',
    [Env.Local]: 'http://localhost:12347/collect',
};

initializeFaro({
    url: endpoint[getEnv()], // required, see below
    app: {
        name: 'arbeidsrettet-dialog', // required
        // version: '1.2.3' // optional; useful in Grafana to get diff between versions
    },
});
