import './polyfill';

import { USE_MOCK } from './constants';
import { erEksternBruker } from './mock/demo/localstorage';
import { initAnalytics } from './metrics/initAnalytics';

const exportToNavSpa = () => {
    // Denne må lazy importeres fordi den laster inn all css selv inn under sin egen shadow-root
    import('./webcomponentWrapper').then(({ DabDialog }) => {
        customElements.define('dab-dialog', DabDialog);
    });
};

const renderAsRootApp = () => {
    import('./rootWrapper').then(({ renderAsReactRoot }) => {
        renderAsReactRoot();
    });
};

const renderApp = () => {
    if (['dev-intern', 'prod-intern'].includes(import.meta.env.MODE)) {
        exportToNavSpa();
    } else {
        renderAsRootApp();
    }
};

if (USE_MOCK) {
    const fnr = erEksternBruker() ? undefined : '12345678901';
    if (fnr) {
        const webComponentTag = document.createElement('dab-dialog');
        webComponentTag.setAttribute('data-fnr', fnr);
        document.getElementById('root')?.appendChild(webComponentTag);
    }

    import('./mock')
        .then(({ default: startWorker }) => startWorker())
        .then(() => {
            if (fnr) {
                exportToNavSpa();
            } else {
                renderAsRootApp();
            }
        });
} else {
    initAnalytics();
    renderApp();
}
