import './global.css';

import { Theme } from '@navikt/ds-react';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './apmInit';
import { createBrowserRouter } from 'react-router';
import { resolveTheme, ThemeMode } from './theme';

const RootWithTheme = () => {
    const [theme, setTheme] = useState<ThemeMode>(resolveTheme());

    useEffect(() => {
        const syncTheme = () => {
            const nextTheme = resolveTheme();
            setTheme((currentTheme) => (currentTheme === nextTheme ? currentTheme : nextTheme));
        };

        const observer = new MutationObserver(syncTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class', 'data-theme'],
        });

        syncTheme();
        return () => observer.disconnect();
    }, []);

    return (
        <Theme theme={theme} hasBackground={false}>
            <App createRouter={createBrowserRouter} />
        </Theme>
    );
};

export const renderAsReactRoot = () => {
    const rootElement = document.getElementById('root');
    createRoot(rootElement!).render(<RootWithTheme />);
};
