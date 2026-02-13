import js from "@eslint/js";
import json from "@eslint/json";
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
  },{
    files: ["**/*.json"],
    // You generally want to ignore package-lock.json
    ignores: ["package-lock.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
    rules: {
      "jsonc/indent": ["error", 2], // Set to 2 or 4 spaces
      "jsonc/comma-dangle": ["error", "never"],
      "jsonc/key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
      "jsonc/array-bracket-newline": ["error", { "multiline": true }],
      "jsonc/sort-keys": "warn",
      "jsonc/no-multi-spaces": "error",
    }
  }
]);
