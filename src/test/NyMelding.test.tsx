import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, expect, Mock } from 'vitest';
import { setupIntegrationTest } from './integrationTestSetup';
import { fetchData } from '../utils/Fetch';
import { DialogApi } from '../api/UseApiBasePath';
import { useDialogStore } from '../view/dialogProvider/dialogStore';

const fnr = '0123456789';
const { App: IntegrationTestApp, worker } = setupIntegrationTest(fnr);

vi.mock('../utils/Fetch', { spy: true });

const tittel = 'Dette er tittel';
const melding = 'Dette er melding';

describe('Ny melding', () => {
    beforeAll(() => {
        worker.listen({
            onUnhandledRequest: (request, er) => {
                console.error(request, er);
            },
        });
    });

    beforeEach(() => {
        (fetchData as unknown as Mock).mockReset();
    });

    afterAll(() => {
        worker.close();
    });

    afterEach(() => {
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
        const { getByLabelText, getByText } = render(<IntegrationTestApp />);
        await waitFor(() => getByLabelText('Meldinger'), { timeout: 10000 });
        const input = getByLabelText('Skriv om arbeid og oppfølging');
        fireEvent.change(input, { target: { value: melding } });
        fireEvent.click(getByText('Send'));
        await waitFor(() =>
            expectOpprettToHaveBeenCalledWith({
                tekst: melding,
                fnr,
                dialogId: '2',
            }),
        );
        await waitFor(() => getByText('Sendt. Bruker får beskjed på sms eller e-post om en halvtime'));
    });

    it('når veileder oppretter en ny dialog skal payload til backend ikke ha dialogId', async () => {
        const { getByLabelText, getByText } = render(<IntegrationTestApp />);
        await waitFor(() => getByLabelText('Meldinger'), { timeout: 2000 });
        await act(async () => fireEvent.click(getByText('Ny dialog')));
        await waitFor(() => getByLabelText('Tema (obligatorisk)'));
        await act(async () => fireEvent.change(getByLabelText('Tema (obligatorisk)'), { target: { value: tittel } }));
        await act(async () =>
            fireEvent.change(getByLabelText('Melding (obligatorisk)'), { target: { value: melding } }),
        );
        fireEvent.click(getByText('Send'));
        await waitFor(() =>
            expectOpprettToHaveBeenCalledWith({
                fnr,
                tekst: melding,
                overskrift: tittel,
                venterPaaSvarFraBruker: false,
            }),
        );
        await waitFor(() => getByText('Sendt. Bruker får beskjed på sms eller e-post om en halvtime'));
    });

    it('når veileder oppretter en ny dialog skal kladd slettes hvis response er success', async () => {
        const { getByLabelText, getByText, findByLabelText } = render(<IntegrationTestApp />);
        await findByLabelText('Meldinger');
        await act(async () => fireEvent.click(getByText('Ny dialog')));
        await findByLabelText('Tema (obligatorisk)');
        await act(async () => fireEvent.change(getByLabelText('Tema (obligatorisk)'), { target: { value: tittel } }));
        await act(async () =>
            fireEvent.change(getByLabelText('Melding (obligatorisk)'), { target: { value: melding } }),
        );

        await waitFor(() => expect(useDialogStore.getState().kladder).toHaveLength(1));

        fireEvent.click(getByText('Send'));

        await waitFor(() => expect(useDialogStore.getState().kladder).toHaveLength(0));
    });

    it.skip('når veileder oppretter en ny dialog skal kladd ikke slettes hvis response er error', async () => {
        vi.when(fetchData)
            .calledWith(DialogApi.opprettDialog, expect.any(Object))
            .thenResolve(Promise.resolve({ status: 500, ok: false }))
            .calledWith(DialogApi.kladd, expect.any(Object))
            .thenResolve(Promise.resolve({ status: 204, ok: true }));

        const { getByLabelText, getByText, findByLabelText, findByText, findByRole } = render(<IntegrationTestApp />);
        await findByLabelText('Meldinger');
        await act(async () => fireEvent.click(getByText('Ny dialog')));
        await findByLabelText('Tema (obligatorisk)');
        await act(async () => fireEvent.change(getByLabelText('Tema (obligatorisk)'), { target: { value: tittel } }));
        await act(async () =>
            fireEvent.change(getByLabelText('Melding (obligatorisk)'), { target: { value: melding } }),
        );

        await waitFor(() => expect(useDialogStore.getState().kladder).toHaveLength(1));

        fireEvent.click(getByText('Send'));

        await waitFor(() => expect(useDialogStore.getState().kladder).toHaveLength(1));
        await findByText('Noe gikk dessverre galt med systemet. Prøv igjen senere.');
    });
});
