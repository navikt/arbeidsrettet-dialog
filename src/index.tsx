import './polyfill';

import NAVSPA from '@navikt/navspa';
import NavFrontendModal from 'nav-frontend-modal';
import React from 'react';
import ReactDOM from 'react-dom';

import DemoBanner from './mock/demo/DemoBanner';
import { erEksternBruker } from './mock/demo/sessionstorage';
import App from './view/App';

const modalAlly = document.getElementById('modal-a11y-wrapper');
const root = document.getElementById('root');

NavFrontendModal.setAppElement(modalAlly ? document.getElementById('modal-a11y-wrapper') : root);

// This is to size the window correctly
const throttle = require('lodash.throttle');

let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener(
    'resize',
    throttle(() => {
        // We execute the same script as before

        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, 100)
);

if (process.env.REACT_APP_MOCK === 'true') {
    require('./mock');

    const elem = document.createElement('div');
    document.body.appendChild(elem);
    ReactDOM.render(<DemoBanner />, elem);

    const fnr = erEksternBruker() ? undefined : '12345678901';
    const AppWrapper = () => <App fnr={fnr} />;

    NAVSPA.eksporter('arbeidsrettet-dialog', AppWrapper);
} else {
    NAVSPA.eksporter('arbeidsrettet-dialog', App);
}
