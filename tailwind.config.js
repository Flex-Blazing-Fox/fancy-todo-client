module.exports = {
  mode: 'jit',
  purge: ['./**/*.html', './src/pages/index.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        nunito: "'Nunito', sans-serif",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
