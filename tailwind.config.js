module.exports = {
    presets: [require('@navikt/ds-tailwind')],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    variants: {
        extend: {}
    },
    plugins: [],
    theme: {
        screens: {
            md: '768px',
            lg: '1024px'
        },
        colors: {
            'border-default': 'rgba(0, 0, 0, 0.44)',
            'border-strong': 'rgba(0, 0, 0, 0.65)',
            'border-divider': 'rgba(0, 0, 0, 0.19)',
            'border-subtle-hover': 'rgba(0, 0, 0, 0.19)',
            'border-subtle': 'rgba(0, 0, 0, 0.1)',
            'border-action-selected': 'rgba(0, 91, 130, 1)',
            'border-action': 'rgba(0, 103, 197, 1)',
            'border-selected': 'rgba(0, 103, 197, 1)',
            'border-success': 'rgba(6, 137, 58, 1)',
            'border-danger': 'rgba(195, 0, 0, 1)',
            'border-warning': 'rgba(199, 115, 0, 1)',
            'border-info': 'rgba(54, 141, 168, 1)',
            'border-focus-on-inverted': 'rgba(153, 195, 255, 1)',
            'border-focus': 'rgba(0, 52, 125, 1)',
            'border-on-inverted': 'rgba(229, 229, 229, 1)',
            'border-on-inverted-subtle': 'rgba(89, 89, 89, 1)',
            'border-alt-1': 'rgba(130, 105, 162, 1)',
            'border-alt-2': 'rgba(127, 137, 0, 1)',
            'border-alt-3': 'rgba(0, 91, 130, 1)',
            transparent: 'rgba(255, 255, 255, 0)',
            white: 'rgba(255, 255, 255, 1)',
            'nav-red': 'rgba(195, 0, 0, 1)',
            'gray-50': 'rgba(247, 247, 247, 1)',
            'gray-100': 'rgba(241, 241, 241, 1)',
            'gray-200': 'rgba(229, 229, 229, 1)',
            'gray-300': 'rgba(207, 207, 207, 1)',
            'gray-400': 'rgba(176, 176, 176, 1)',
            'gray-500': 'rgba(143, 143, 143, 1)',
            'gray-600': 'rgba(112, 112, 112, 1)',
            'gray-700': 'rgba(89, 89, 89, 1)',
            'gray-800': 'rgba(64, 64, 64, 1)',
            'gray-900': 'rgba(38, 38, 38, 1)',
            'grayalpha-50': 'rgba(0, 0, 0, 0.03)',
            'grayalpha-100': 'rgba(0, 0, 0, 0.05)',
            'grayalpha-200': 'rgba(0, 0, 0, 0.1)',
            'grayalpha-300': 'rgba(0, 0, 0, 0.19)',
            'grayalpha-400': 'rgba(0, 0, 0, 0.31)',
            'grayalpha-500': 'rgba(0, 0, 0, 0.44)',
            'grayalpha-600': 'rgba(0, 0, 0, 0.56)',
            'grayalpha-700': 'rgba(0, 0, 0, 0.65)',
            'grayalpha-800': 'rgba(0, 0, 0, 0.75)',
            'grayalpha-900': 'rgba(0, 0, 0, 0.85)',
            'blue-50': 'rgba(230, 240, 255, 1)',
            'blue-100': 'rgba(204, 225, 255, 1)',
            'blue-200': 'rgba(153, 195, 255, 1)',
            'blue-300': 'rgba(102, 165, 244, 1)',
            'blue-400': 'rgba(51, 134, 224, 1)',
            'blue-500': 'rgba(0, 103, 197, 1)',
            'blue-600': 'rgba(0, 86, 180, 1)',
            'blue-700': 'rgba(0, 69, 156, 1)',
            'blue-800': 'rgba(0, 52, 125, 1)',
            'blue-900': 'rgba(0, 34, 82, 1)',
            'red-50': 'rgba(255, 230, 230, 1)',
            'red-100': 'rgba(255, 194, 194, 1)',
            'red-200': 'rgba(246, 130, 130, 1)',
            'red-300': 'rgba(242, 92, 92, 1)',
            'red-400': 'rgba(222, 46, 46, 1)',
            'red-500': 'rgba(195, 0, 0, 1)',
            'red-600': 'rgba(173, 0, 0, 1)',
            'red-700': 'rgba(140, 0, 0, 1)',
            'red-800': 'rgba(92, 0, 0, 1)',
            'red-900': 'rgba(38, 0, 0, 1)',
            'deepblue-50': 'rgba(230, 241, 248, 1)',
            'deepblue-100': 'rgba(204, 226, 240, 1)',
            'deepblue-200': 'rgba(153, 196, 221, 1)',
            'deepblue-300': 'rgba(102, 163, 196, 1)',
            'deepblue-400': 'rgba(51, 128, 165, 1)',
            'deepblue-500': 'rgba(0, 91, 130, 1)',
            'deepblue-600': 'rgba(0, 80, 119, 1)',
            'deepblue-700': 'rgba(0, 67, 103, 1)',
            'deepblue-800': 'rgba(0, 52, 83, 1)',
            'deepblue-900': 'rgba(0, 36, 58, 1)',
            'green-50': 'rgba(243, 252, 245, 1)',
            'green-100': 'rgba(204, 241, 214, 1)',
            'green-200': 'rgba(153, 222, 173, 1)',
            'green-300': 'rgba(102, 199, 134, 1)',
            'green-400': 'rgba(51, 170, 95, 1)',
            'green-500': 'rgba(6, 137, 58, 1)',
            'green-600': 'rgba(0, 124, 46, 1)',
            'green-700': 'rgba(0, 106, 35, 1)',
            'green-800': 'rgba(0, 85, 25, 1)',
            'green-900': 'rgba(0, 59, 15, 1)',
            'lightblue-50': 'rgba(235, 252, 255, 1)',
            'lightblue-100': 'rgba(216, 249, 255, 1)',
            'lightblue-200': 'rgba(181, 241, 255, 1)',
            'lightblue-300': 'rgba(151, 230, 255, 1)',
            'lightblue-400': 'rgba(124, 218, 248, 1)',
            'lightblue-500': 'rgba(102, 203, 236, 1)',
            'lightblue-600': 'rgba(76, 173, 205, 1)',
            'lightblue-700': 'rgba(54, 141, 168, 1)',
            'lightblue-800': 'rgba(35, 107, 125, 1)',
            'lightblue-900': 'rgba(19, 72, 82, 1)',
            'limegreen-50': 'rgba(253, 255, 230, 1)',
            'limegreen-100': 'rgba(249, 252, 204, 1)',
            'limegreen-200': 'rgba(236, 243, 153, 1)',
            'limegreen-300': 'rgba(217, 227, 102, 1)',
            'limegreen-400': 'rgba(193, 203, 51, 1)',
            'limegreen-500': 'rgba(162, 173, 0, 1)',
            'limegreen-600': 'rgba(147, 158, 0, 1)',
            'limegreen-700': 'rgba(127, 137, 0, 1)',
            'limegreen-800': 'rgba(102, 110, 0, 1)',
            'limegreen-900': 'rgba(71, 78, 0, 1)',
            'orange-50': 'rgba(255, 249, 240, 1)',
            'orange-100': 'rgba(255, 236, 204, 1)',
            'orange-200': 'rgba(255, 215, 153, 1)',
            'orange-300': 'rgba(255, 193, 102, 1)',
            'orange-400': 'rgba(255, 170, 51, 1)',
            'orange-500': 'rgba(255, 145, 0, 1)',
            'orange-600': 'rgba(199, 115, 0, 1)',
            'orange-700': 'rgba(168, 100, 0, 1)',
            'orange-800': 'rgba(125, 76, 0, 1)',
            'orange-900': 'rgba(82, 51, 0, 1)',
            'purple-50': 'rgba(239, 236, 244, 1)',
            'purple-100': 'rgba(224, 216, 233, 1)',
            'purple-200': 'rgba(192, 178, 210, 1)',
            'purple-300': 'rgba(161, 141, 187, 1)',
            'purple-400': 'rgba(130, 105, 162, 1)',
            'purple-500': 'rgba(99, 70, 137, 1)',
            'purple-600': 'rgba(82, 56, 116, 1)',
            'purple-700': 'rgba(65, 43, 93, 1)',
            'purple-800': 'rgba(48, 31, 70, 1)',
            'purple-900': 'rgba(31, 20, 47, 1)',
            'text-default': 'rgba(38, 38, 38, 1)',
            'text-subtle': 'rgba(0, 0, 0, 0.56)',
            'text-visited': 'rgba(99, 70, 137, 1)',
            'text-danger': 'rgba(195, 0, 0, 1)',
            'text-action-selected': 'rgba(0, 91, 130, 1)',
            'text-action-on-action-subtle': 'rgba(0, 86, 180, 1)',
            'text-action': 'rgba(0, 103, 197, 1)',
            'text-on-inverted': 'rgba(255, 255, 255, 1)',
            'text-on-neutral': 'rgba(255, 255, 255, 1)',
            'text-on-action': 'rgba(255, 255, 255, 1)',
            'text-on-success': 'rgba(255, 255, 255, 1)',
            'text-on-danger': 'rgba(255, 255, 255, 1)',
            'text-on-warning': 'rgba(38, 38, 38, 1)',
            'text-on-info': 'rgba(38, 38, 38, 1)',
            'text-on-alt-1': 'rgba(255, 255, 255, 1)',
            'text-on-alt-2': 'rgba(38, 38, 38, 1)',
            'text-on-alt-3': 'rgba(255, 255, 255, 1)',
            'bg-default': 'rgba(255, 255, 255, 1)',
            'bg-subtle': 'rgba(241, 241, 241, 1)',
            'surface-default': 'rgba(255, 255, 255, 1)',
            'surface-hover': 'rgba(0, 0, 0, 0.05)',
            'surface-active': 'rgba(0, 0, 0, 0.1)',
            'surface-selected': 'rgba(230, 240, 255, 1)',
            'surface-subtle': 'rgba(247, 247, 247, 1)',
            'surface-transparent': 'rgba(255, 255, 255, 0)',
            'surface-backdrop': 'rgba(0, 0, 0, 0.65)',
            'surface-inverted-hover': 'rgba(64, 64, 64, 1)',
            'surface-inverted-active': 'rgba(89, 89, 89, 1)',
            'surface-inverted': 'rgba(38, 38, 38, 1)',
            'surface-action-subtle-hover': 'rgba(204, 225, 255, 1)',
            'surface-action-subtle': 'rgba(230, 240, 255, 1)',
            'surface-action-hover': 'rgba(0, 86, 180, 1)',
            'surface-action-active': 'rgba(0, 91, 130, 1)',
            'surface-action-selected-hover': 'rgba(0, 80, 119, 1)',
            'surface-action-selected': 'rgba(0, 91, 130, 1)',
            'surface-action': 'rgba(0, 103, 197, 1)',
            'surface-neutral-subtle-hover': 'rgba(0, 0, 0, 0.1)',
            'surface-neutral-subtle': 'rgba(0, 0, 0, 0.05)',
            'surface-neutral-hover': 'rgba(64, 64, 64, 1)',
            'surface-neutral-selected': 'rgba(38, 38, 38, 1)',
            'surface-neutral-active': 'rgba(38, 38, 38, 1)',
            'surface-neutral': 'rgba(89, 89, 89, 1)',
            'surface-success-subtle-hover': 'rgba(153, 222, 173, 1)',
            'surface-success-subtle': 'rgba(204, 241, 214, 1)',
            'surface-success': 'rgba(6, 137, 58, 1)',
            'surface-success-hover': 'rgba(0, 124, 46, 1)',
            'surface-danger-subtle-hover': 'rgba(246, 130, 130, 1)',
            'surface-danger-subtle': 'rgba(255, 194, 194, 1)',
            'surface-danger-hover': 'rgba(173, 0, 0, 1)',
            'surface-danger-active': 'rgba(140, 0, 0, 1)',
            'surface-danger': 'rgba(195, 0, 0, 1)',
            'surface-warning-subtle-hover': 'rgba(255, 215, 153, 1)',
            'surface-warning-subtle': 'rgba(255, 236, 204, 1)',
            'surface-warning': 'rgba(255, 145, 0, 1)',
            'surface-info-subtle-hover': 'rgba(181, 241, 255, 1)',
            'surface-info-subtle': 'rgba(216, 249, 255, 1)',
            'surface-info': 'rgba(102, 203, 236, 1)',
            'surface-alt-1-subtle': 'rgba(224, 216, 233, 1)',
            'surface-alt-1': 'rgba(130, 105, 162, 1)',
            'surface-alt-2-subtle': 'rgba(249, 252, 204, 1)',
            'surface-alt-2': 'rgba(193, 203, 51, 1)',
            'surface-alt-3-subtle': 'rgba(204, 226, 240, 1)',
            'surface-alt-3-strong': 'rgba(0, 52, 83, 1)',
            'surface-alt-3': 'rgba(0, 91, 130, 1)',
            'icon-default': 'rgba(38, 38, 38, 1)',
            'icon-subtle': 'rgba(112, 112, 112, 1)',
            'icon-action-selected': 'rgba(0, 91, 130, 1)',
            'icon-action-on-action-subtle': 'rgba(0, 86, 180, 1)',
            'icon-action': 'rgba(0, 103, 197, 1)',
            'icon-success': 'rgba(6, 137, 58, 1)',
            'icon-danger': 'rgba(195, 0, 0, 1)',
            'icon-warning': 'rgba(199, 115, 0, 1)',
            'icon-info': 'rgba(35, 107, 125, 1)',
            'icon-alt-1': 'rgba(99, 70, 137, 1)',
            'icon-alt-2': 'rgba(127, 137, 0, 1)',
            'icon-alt-3': 'rgba(51, 128, 165, 1)',
            'icon-on-neutral': 'rgba(255, 255, 255, 1)',
            'icon-on-inverted': 'rgba(255, 255, 255, 1)',
            'icon-on-action': 'rgba(255, 255, 255, 1)',
            'icon-on-success': 'rgba(255, 255, 255, 1)',
            'icon-on-danger': 'rgba(255, 255, 255, 1)',
            'icon-on-warning': 'rgba(38, 38, 38, 1)',
            'icon-on-info': 'rgba(38, 38, 38, 1)'
        },
        extend: {
            height: {
                '300px': '300px'
            },
            minWidth: {
                52: '13rem'
            },
            maxWidth: {
                lgContainer: '700px'
            },
            maxHeight: {
                'screen-h-1/2': '50vh'
            },
            spacing: {
                0: '0',
                1: '0.25rem',
                2: '0.5rem',
                3: '0.75rem',
                4: '1rem',
                5: '1.25rem',
                6: '1.5rem',
                7: '1.75rem',
                8: '2rem',
                9: '2.25rem',
                10: '2.5rem',
                11: '2.75rem',
                12: '3rem',
                14: '3.5rem',
                16: '4rem',
                18: '4.5rem',
                20: '5rem',
                24: '6rem',
                32: '8rem',
                '05': '0.125rem',
                104: '26rem',
                120: '40rem'
            },
            zIndex: {
                modal: 2000,
                popover: 1000,
                focus: 10,
                tooltip: 3000
            },
            boxShadow: {
                xsmall: '0 1px 2px 0 rgba(0, 0, 0, 0.12)',
                small: '0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                medium: '0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                large: '0 4px 6px -4px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                xlarge: '0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 25px 50px -5px rgba(0, 0, 0, 0.1)',
                'focus-inverted': '0 0 0 3px rgba(153, 195, 255, 1)',
                focus: '0 0 0 3px rgba(0, 52, 125, 1)'
            },
            fontWeight: {
                bold: '600',
                regular: '400'
            },
            fontSize: {
                'heading-2xlarge': '2.5rem',
                'heading-xlarge': '2rem',
                'heading-large': '1.75rem',
                'heading-medium': '1.5rem',
                'heading-small': '1.25rem',
                'heading-xsmall': '1.125rem',
                xlarge: '1.25rem',
                large: '1.125rem',
                medium: '1rem',
                small: '0.875rem'
            },
            lineHeight: {
                'heading-2xlarge': '3.25rem',
                'heading-xlarge': '2.5rem',
                'heading-large': '2.25rem',
                'heading-medium': '2rem',
                'heading-small': '1.75rem',
                'heading-xsmall': '1.5rem',
                xlarge: '1.75rem',
                large: '1.5rem',
                medium: '1.25rem'
            },
            fontFamily: {
                'font-family': '"Source Sans Pro", Arial, sans-serif'
            },
            borderRadius: {
                small: '2px',
                medium: '4px',
                large: '8px',
                xlarge: '12px',
                full: '9999px'
            }
        }
    }
};
