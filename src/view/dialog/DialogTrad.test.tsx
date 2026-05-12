import { describe } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { setupIntegrationTest } from '../../test/integrationTestSetup';

const fnr = '0123456789';
const { App: IntegrationTestApp, worker } = setupIntegrationTest(fnr, ['/303']);

describe('DialogTrad', () => {
    beforeAll(() => worker.listen({ onUnhandledRequest: 'error' }));
    afterAll(() => worker.close());
    afterEach(() => worker.resetHandlers());

    it('should display dialog-state from backend', async () => {
        const { getByLabelText, getByText } = render(<IntegrationTestApp />);
        await waitFor(() => getByLabelText('Meldinger'), { timeout: 10000 });
        await waitFor(() => getByLabelText('Skriv om arbeid og oppfølging', { selector: 'textarea' }));
        getByText('Jobb jeg har nå: LALALA');
        getByText('Er du fornøyd med oppgfølgingen?');
        getByText('Sånn passe.');
    });
});
