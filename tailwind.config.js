const colorMapper = require('./src/utils/colorMapper')
const theme = require('./theme.json')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.html",
    "./src/slices/**/*.html"
  ],
  theme: {
    container: false, 
    fontSize: false,
    extend: {
      colors: colorMapper(theme.settings.color.palette)
    },
    screens: {
      xs: theme.settings.layout["xs"],
      sm: theme.settings.layout["sm"],
      md: theme.settings.layout["md"],
      lg: theme.settings.layout["lg"],
      xl: theme.settings.layout["xl"],
      "2xl": theme.settings.layout["2xl"],
      "3xl": theme.settings.layout["3xl"],
      "4xl": theme.settings.layout["4xl"],
      "5xl": theme.settings.layout["5xl"],
      "6xl": theme.settings.layout["6xl"],
      "4k": theme.settings.layout["4k"]
    },
  },
  plugins: [],
}

