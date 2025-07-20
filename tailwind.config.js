/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'facebook-blue': '#1877F2',
                'facebook-dark': '#1C2526',
                'facebook-gray': '#F0F2F5',
            },
        },
    },
    plugins: [],
};