import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from '../src/mock/handlers';
import { rest } from 'msw';
import { FeatureToggle } from '../src/featureToggle/const';
import bruker from '../src/mock/Bruker';

// Initialize MSW
initialize();

const viewports = {
    mobile: {
        name: 'Mobil',
        styles: {
            width: '350px',
            height: '600px'
        }
    },
    tablet: {
        name: 'Tablet',
        styles: {
            width: '900px',
            height: '700px'
        }
    },
    laptop: {
        name: 'Laptop (lg)',
        styles: {
            width: '1024px',
            height: '720px'
        }
    },
    laptop2: {
        name: 'Laptop (xl)',
        styles: {
            width: '1280px',
            height: '720px'
        }
    },
    desktop: {
        name: 'Desktop (2xl)',
        styles: {
            width: '1920px',
            height: '1080px'
        }
    }
};

const configurableMocks = ['/veilarbaktivitet/api/feature', '/veilarboppfolging/api/oppfolging/me'];

const preview: Preview = {
    parameters: {
        viewport: {
            viewports
        },
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/
            }
        },
        msw: {
            handlers: {
                default: handlers.filter((it) => !configurableMocks.includes(it.info.path.toString())),
                brukerMock: [rest.get('/veilarboppfolging/api/oppfolging/me', (_, res, ctx) => res(ctx.json(bruker)))],
                featureToggle: [
                    rest.get('/veilarbaktivitet/api/feature', (_, res, ctx) =>
                        res(ctx.json({ [FeatureToggle.VIS_SKJUL_AKTIVITET_KNAPP]: false }))
                    )
                ]
            }
        }
    },
    loaders: [mswLoader]
};

export default preview;
