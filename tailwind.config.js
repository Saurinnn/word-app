import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Noto Sans"', '"Noto Sans CJK JP"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: '#58CC02',
                    hover: '#46A302',
                    active: '#46A302',
                },
                success: {
                    DEFAULT: '#4CAF50',
                    hover: '#43A047',
                },
                error: {
                    DEFAULT: '#F44336',
                    hover: '#E53935',
                },
                neutral: '#777777',
            }
        },
    },

    plugins: [forms],
};
