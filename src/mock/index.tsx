import { setupWorker } from 'msw/browser';
import React from 'react';
import { createRoot } from 'react-dom/client';

import DemoBanner from './demo/DemoBanner';
import { handlers } from './handlers';
import { opprettDialogEtterRender } from './Dialog';

const worker = setupWorker(...handlers);
opprettDialogEtterRender();

export default () =>
    worker
        .start({
            serviceWorker: {
                url: `${import.meta.env.BASE_URL}mockServiceWorker.js`
            },
            onUnhandledRequest: (req, print) => {
                const hostBlacklist = ['amplitude.nav.no', 'nav.psplugin.com'];
                const ignoredFileExtensions = ['.ts', '.js', '.tsx', '.jsx', 'css', 'svg', 'png', '.less'];

                const ignore =
                    hostBlacklist.some((route) => req.url.includes(route)) ||
                    ignoredFileExtensions.some((fileExtension) => req.url.split('?')[0].endsWith(fileExtension));

                if (ignore) {
                    return;
                }

                print.warning();
            }
        })
        .then(() => {
            const elem = document.createElement('div');
            document.body.appendChild(elem);
            createRoot(elem).render(<DemoBanner />);
        });
