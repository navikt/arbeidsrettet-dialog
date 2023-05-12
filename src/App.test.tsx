import React from 'react';
import { createRoot } from 'react-dom/client';
import { it } from 'vitest';

import App from './App';

it('renders without crashing', () => {
    const root = createRoot(document.createElement('div'));
    root.render(<App />);
    root.unmount();
});
