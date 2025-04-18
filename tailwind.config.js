/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          'ship-gray': '#555555',
          'hit-red': '#ff5555',
          'miss-blue': '#5555ff',
          'water-blue': '#aaddff',
        },
      },
    },
    plugins: [],
  };