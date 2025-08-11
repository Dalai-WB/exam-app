/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': {
          DEFAULT: '#42A5F5'
        },
      }
    },
  },
  plugins: [],
}
