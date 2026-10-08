import './global.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './apmInit';
import { createBrowserRouter } from 'react-router';

export const renderAsReactRoot = () => {
    const rootElement = document.getElementById('root');
    // Bare brukerflaten rendres på denne måten
    createRoot(rootElement!).render(<App erVeileder={false} createRouter={createBrowserRouter} />);
};
