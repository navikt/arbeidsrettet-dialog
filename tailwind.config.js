// const naviktTailwindPreset = require('@navikt/ds-tailwind');

module.exports = {
    presets: [require('@navikt/ds-tailwind/darkside-tw3')],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins: [],
    theme: {
        extend: {
            maxWidth: {
                'screen-w-1/3': '33vw',
                'screen-w-1/4': '25vw',
                'max-paragraph': '40rem',
                248: '40.75rem',
                lgContainer: '700px',
            },
        },
        screens: {
            sm: '480px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1920px',
        },
    },
};
