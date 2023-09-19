import './global.css';

import { Modal } from '@navikt/ds-react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

export const renderAsReactRoot = (fnr?: string) => {
    const rootElement = document.getElementById('root');
    createRoot(rootElement!).render(<App fnr={fnr} key={'1'} />);
};
