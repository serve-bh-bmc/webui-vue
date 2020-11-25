module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/recommended", "eslint:recommended", "@vue/prettier"],
  rules: {
<<<<<<< HEAD
    "no-console": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": 1,
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "vue/custom-event-name-casing": ["warn"],
    "no-unused-vars": 1,
    quotes: [1, "double"],
=======
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
      },
    ],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
>>>>>>> e7eb9dc6c2c1e5969e0bddc23521cd3e11eacb22
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
