// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
    trailingComma: 'all',
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    plugins: ['prettier-plugin-tailwindcss'],
}

module.exports = config
