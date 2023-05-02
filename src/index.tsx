import './polyfill';

import { Modal } from '@navikt/ds-react';
import NAVSPA from '@navikt/navspa';
// This is to size the window correctly
import throttle from 'lodash.throttle';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { USE_MOCK } from './constants';
// import { initAmplitude } from './metrics/amplitude-utils';
import DemoBanner from './mock/demo/DemoBanner';
import { erEksternBruker } from './mock/demo/localstorage';
import { gotoStartTestPage } from './mock/Utils';
import { pathnamePrefix } from './utils/UseApiBasePath';

const modalAlly = document.getElementById('modal-a11y-wrapper');
const root = document.getElementById('root');

console.log('env', import.meta.env);

// TODO: Only use this in dev?
// initAmplitude();

Modal.setAppElement(modalAlly ? document.getElementById('modal-a11y-wrapper') : root);

let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener(
    'resize',
    throttle(() => {
        // We execute the same script as before
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100)
);

const navspaName = 'arbeidsrettet-dialog';
function render() {
    return window.NAVSPA[navspaName](document.getElementById('root'));
}

if (USE_MOCK) {
    const fnr = erEksternBruker() ? undefined : '12345678901';
    gotoStartTestPage(fnr);

    import('./mock')
        .then(({ default: startWorker }) => startWorker())
        .then(() => {
            const elem = document.createElement('div');
            document.body.appendChild(elem);
            ReactDOM.render(<DemoBanner />, elem);

            const AppWrapper = () => <App fnr={fnr} />;

            NAVSPA.eksporter(navspaName, AppWrapper);
            render();
        });
} else {
    NAVSPA.eksporter(navspaName, App);
    render();
}
