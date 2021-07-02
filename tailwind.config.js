module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primarycolor: "#F9A826",
      },
    },
    fontFamily: {
      display: ["Nunito", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};