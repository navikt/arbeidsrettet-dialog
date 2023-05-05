import './polyfill';

import NAVSPA from '@navikt/navspa';
// This is to size the window correctly
// import throttle from 'lodash.throttle';
import React from 'react';
import ReactDOM from 'react-dom';

import AppWebComponent from './AppWebComponent';
import { USE_MOCK } from './constants';
import { initAmplitude } from './metrics/amplitude-utils';
import DemoBanner from './mock/demo/DemoBanner';
import { erEksternBruker } from './mock/demo/localstorage';
import { gotoStartTestPage } from './mock/Utils';

// let vh = window.innerHeight * 0.01;
// // Then we set the value in the --vh custom property to the root of the document
// document.documentElement.style.setProperty('--vh', `${vh}px`);
//
// // We listen to the resize event
// window.addEventListener(
//     'resize',
//     throttle(() => {
//         // We execute the same script as before
//         document.documentElement.style.setProperty('--vh', `${vh}px`);
//     }, 100)
// );

const exportToNavSpa = () => {
    NAVSPA.eksporter('arbeidsrettet-dialog', AppWebComponent);
    // Denne må lazy importeres fordi den laster inn all css selv inn under sin egen shadow-root
    import('./webcomponentWrapper').then(({ DabDialog }) => {
        customElements.define('dab-dialog', DabDialog);
    });
};

const renderAsRootApp = (fnr?: string) => {
    import('./rootWrapper').then(({ renderAsReactRoot }) => {
        renderAsReactRoot(fnr);
    });
};

const renderApp = (fnr?: string) => {
    if (['dev-intern', 'prod-intern'].includes(import.meta.env.MODE)) {
        exportToNavSpa();
    } else {
        renderAsRootApp(fnr);
    }
};

if (USE_MOCK) {
    const fnr = erEksternBruker() ? undefined : '12345678901';
    gotoStartTestPage(fnr);

    import('./mock')
        .then(({ default: startWorker }) => startWorker())
        .then(() => {
            const elem = document.createElement('div');
            document.body.appendChild(elem);
            ReactDOM.render(<DemoBanner />, elem);
            renderApp(fnr);
        });
} else {
    initAmplitude();
    renderApp();
}
