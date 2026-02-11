import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "no-console": "off", // Allow console.log
      "prefer-const": "error", // Force 'const' over 'let' if value doesn't change
      "eqeqeq": ["error", "always"],
      "no-var": "error",
      "indent": ["error", 2],
      "semi": ["error", "always"]
    },
  },
]);
