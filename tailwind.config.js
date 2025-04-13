/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': {
          DEFAULT: '#7ED4AD'
        },
      }
    },
  },
  plugins: [],
}
