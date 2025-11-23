// file: postcss.config.mjs

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // Ini adalah engine v4 yg baru kita install
    autoprefixer: {},
  },
}

export default config