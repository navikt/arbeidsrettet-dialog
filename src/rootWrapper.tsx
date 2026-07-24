import './global.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './apmInit';
import { createBrowserRouter } from 'react-router';

export const renderAsReactRoot = () => {
    const rootElement = document.getElementById('root');
    createRoot(rootElement!).render(<App createRouter={createBrowserRouter} />);
};
