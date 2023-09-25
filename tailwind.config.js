const naviktTailwindPreset = require('@navikt/ds-tailwind');

module.exports = {
    presets: [naviktTailwindPreset],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins: [],
    theme: {
        extend: {
            maxWidth: {
                'screen-w-1/3': '33vw',
                'screen-w-1/4': '25vw',
                'max-paragraph': '40rem',
                248: '62rem',
                lgContainer: '700px'
            }
        },
        screens: {
            sm: '480px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1600px'
        }
    }
};
