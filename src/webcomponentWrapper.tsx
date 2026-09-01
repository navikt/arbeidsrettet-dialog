// @ts-ignore - vite handles ?inline imports
import dsStyles from '@navikt/ds-css/dist/index.css?inline';
import { Provider as ModalProvider, Theme } from '@navikt/ds-react';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';

import App from './App';
import globalCss from './global.css?inline';
import dialogOversiktStyles from './view/dialogliste/DialogPreview.module.css?inline';
import { useFnrStore } from './fnrStore';
import { createBrowserRouter } from 'react-router';
import { resolveTheme, ThemeMode } from './theme';

export class DabDialog extends HTMLElement {
    setFnr?: (fnr: string) => void;
    root?: Root;
    shadowDomFirstChild?: HTMLDivElement;
    themeObserver?: MutationObserver;
    theme: ThemeMode = 'light';

    private syncTheme = () => {
        if (!this.shadowDomFirstChild || !this.root) return;

        const nextTheme = resolveTheme(this);
        if (nextTheme === this.theme) return;

        this.theme = nextTheme;
        this.root.render(
            <ModalProvider rootElement={this.shadowDomFirstChild}>
                <Theme theme={nextTheme} hasBackground={false}>
                    <App createRouter={createBrowserRouter} />
                </Theme>
            </ModalProvider>,
        );
    };

    connectedCallback() {
        // Cant mount on shadowRoot, create a extra div for mounting modal
        const shadowDomFirstChild = document.createElement('div');
        this.shadowDomFirstChild = shadowDomFirstChild;
        // This will be app entry point, need to be outside modal-mount node
        const appRoot = document.createElement('div');
        appRoot.id = 'dialog-root';
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(shadowDomFirstChild);
        shadowDomFirstChild.appendChild(appRoot);

        // Load styles under this shadowDom-node, not root element
        const styleElem = document.createElement('style');
        styleElem.textContent = dsStyles + globalCss + dialogOversiktStyles;
        shadowRoot.appendChild(styleElem);

        const fnr = this.getAttribute('data-fnr') ?? undefined;
        try {
            useFnrStore.getState().setFnr(fnr);
            this.root = createRoot(appRoot);
            this.theme = resolveTheme(this);
            this.root.render(
                <ModalProvider rootElement={shadowDomFirstChild}>
                    <Theme theme={this.theme} hasBackground={false}>
                        <App createRouter={createBrowserRouter} />
                    </Theme>
                </ModalProvider>,
            );

            this.themeObserver = new MutationObserver(this.syncTheme);
            this.themeObserver.observe(document.documentElement, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class', 'data-theme'],
            });
        } catch (e) {
            console.error(e);
        }
    }

    disconnectedCallback() {
        this.themeObserver?.disconnect();
        this.root?.unmount();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'data-fnr') {
            useFnrStore.getState().setFnr(newValue);
        }
    }
    static get observedAttributes() {
        return ['data-fnr'];
    }
}
