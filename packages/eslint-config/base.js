import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.Config} */
export default {
  extends: [
    ...js.configs.recommended,
    ...tseslint.configs.recommended,
    "prettier",
  ],
  plugins: ["only-warn", "turbo"],
  rules: {
    "turbo/no-undeclared-env-vars": "warn",
  },
  ignorePatterns: ["dist/**"],
};
