module.exports = {
  root: true,
  extends: ["next", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "prefer-const": "error",
    "no-irregular-whitespace": "error",
    "no-trailing-spaces": "error",
    "no-duplicate-imports": "error",
  },
};
