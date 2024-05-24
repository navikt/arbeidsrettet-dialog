import { beforeAll, describe } from 'vitest';
import { act, render } from '@testing-library/react';
import { createMemoryRouter } from 'react-router';
import React from 'react';
import { setupServer } from 'msw/node';
import { handlers } from '../../mock/handlers';
import { dialogRoutes } from '../../routing/routes';
import App from '../../App';

const dialogId = '303';

const memoryRouter = createMemoryRouter(dialogRoutes, {
    initialEntries: [`/${dialogId}`]
});

const server = setupServer(...handlers);

describe('DialogTrad', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    it('should display state from backend if no kladd', async () => {
        const { getByLabelText, getByText } = await act(() => render(<App />));
        getByText('Avklaring: Avklaring');
        await act(() => getByText('Avklaring: Avklaring').click());
        getByLabelText('Skriv om arbeid og oppfølging');
        getByText('Er du fornøyd med oppgfølgingen?');
        getByText('Sånn passe.');
    });

    it('should display kladd and not backend state if kladd exists', () => {
        // TODO
    });

    it('should display kladd event when updating state from backend', () => {
        // TODO
    });
});
