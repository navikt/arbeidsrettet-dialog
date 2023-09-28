import type { Meta, StoryObj } from '@storybook/react';

import { Page } from './Page';

const meta = {
    title: 'App/Default',
    component: Page,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen'
    }
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
export const Landing: Story = {
    args: {
        path: '/'
    }
};

export const DialogMedAktivitet: Story = {
    args: {
        path: '/303'
    }
};

export const DialogUtenAktivitet: Story = {
    args: {
        path: '/2'
    }
};

export const Historisk: Story = {
    args: {
        path: '100'
    }
};

export const NyDialog: Story = {
    args: {
        path: '/ny'
    }
};
