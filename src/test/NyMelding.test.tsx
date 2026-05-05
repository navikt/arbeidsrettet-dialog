import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, Mock } from 'vitest';
import { setupIntegrationTest } from './integrationTestSetup';
import { fetchData } from '../utils/Fetch';
import { DialogApi } from '../api/UseApiBasePath';

const fnr = '0123456789';
const { App: IntegrationTestApp, worker } = setupIntegrationTest(fnr);

vi.mock('../utils/Fetch', { spy: true });

describe('Ny melding', () => {
    beforeAll(() => {
        worker.listen({
            onUnhandledRequest: (request, er) => {
                console.error(request, er);
            },
        });
    });
    afterAll(() => {
        worker.close();
    });

    afterEach(() => {
        worker.resetHandlers();
        vi.clearAllMocks();
    });

    const expectOpprettToHaveBeenCalledWith = (body: Record<any, any>) => {
        const callsToOpprett = (fetchData as unknown as Mock).mock.calls.filter((call) => {
            return call[0] === `${DialogApi.opprettDialog}`;
        });
        expect(callsToOpprett).toHaveLength(1);
        const { 0: url, 1: payload } = callsToOpprett[0]; //NOSONAR
        expect(JSON.parse(payload.body)).toEqual(body);
    };

    it('når veileder sender en melding skal payload inneholde dialogId', async () => {
        const { getByLabelText, getByText } = await act(() => render(<IntegrationTestApp />));
        await waitFor(() => getByLabelText('Meldinger'), { timeout: 10000 });
        const input = getByLabelText('Skriv om arbeid og oppfølging');
        const melding = 'Dette er en ny melding';
        fireEvent.change(input, {
            target: { value: melding },
        });
        const sendKnapp = getByText('Send');
        await act(async () => sendKnapp.click());
        expectOpprettToHaveBeenCalledWith({
            tekst: melding,
            fnr,
            dialogId: '2',
        });
        await waitFor(() => getByText('Sendt. Bruker får beskjed på sms eller e-post om en halvtime'));
    });

    it('når veileder oppretter en ny dialog payload til backend ikke ha dialogId', async () => {
        const { getByLabelText, getByText } = await act(() => render(<IntegrationTestApp />));
        await waitFor(() => getByLabelText('Meldinger'), { timeout: 10000 });
        await act(async () => getByText('Ny dialog').click());
        const input = getByLabelText('Tema (obligatorisk)');
        const tittel = 'Dette er tittel';
        await act(() =>
            fireEvent.change(input, {
                target: { value: tittel },
            }),
        );
        const meldingInput = getByLabelText('Melding (obligatorisk)');
        const melding = 'Dette er melding';
        await act(() =>
            fireEvent.change(meldingInput, {
                target: { value: melding },
            }),
        );
        const sendKnapp = getByText('Send');
        await act(async () => sendKnapp.click());
        expectOpprettToHaveBeenCalledWith({
            fnr,
            tekst: melding,
            overskrift: tittel,
            venterPaaSvarFraBruker: false,
        });
        await waitFor(() => getByText('Sendt. Bruker får beskjed på sms eller e-post om en halvtime'));
    });
});
