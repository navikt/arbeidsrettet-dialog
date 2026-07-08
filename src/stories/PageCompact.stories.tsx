import type { Meta, StoryObj } from '@storybook/react-vite';

import { Page } from './Page';
import { http } from 'msw';
import { FeatureToggle } from '../featureToggle/const';
import { veileder } from '../mock/Bruker';
import { jsonResponse } from '../mock/handlers';

const meta = {
    title: 'App/Compact',
    component: Page,
    parameters: {
        chromatic: { delay: 500 },
        // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
        msw: {
            handlers: {
                brukerMock: [http.get('/veilarboppfolging/api/oppfolging/me', jsonResponse(veileder))],
                featureToggle: [
                    http.get(
                        '/veilarbaktivitet/api/feature',
                        jsonResponse({ [FeatureToggle.VIS_SKJUL_AKTIVITET_KNAPP]: true })
                    )
                ]
            }
        }
    },
    args: {
        path: '/'
    },
    argTypes: {
        visAktivitet: {
            name: 'Vis aktivitet',
            options: [false, true],
            type: 'boolean'
        }
    }
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;
// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing

export const Landing: Story = {
    args: {
        path: '/',
        erVeileder: true
    }
};

export const MedAktivitetVisAktivitet: Story = {
    args: {
        visAktivitet: true,
        path: '/10',
        erVeileder: true
    }
};

export const MedAktivitetIkkeVisAktivitet: Story = {
    args: {
        visAktivitet: false,
        path: '/10',
        erVeileder: true
    }
};

export const DialogUtenAktivitet: Story = {
    args: {
        path: '/2',
        erVeileder: true
    }
};

export const HistoriskVisAktivitet: Story = {
    args: {
        visAktivitet: true,
        path: '100',
        erVeileder: true
    }
};
export const HistoriskIkkeVisAktivitet: Story = {
    args: {
        visAktivitet: false,
        path: '100',
        erVeileder: true
    }
};

export const NyDialog: Story = {
    args: {
        path: '/ny',
        erVeileder: true
    }
};
