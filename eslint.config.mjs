import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJs from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslintJs.configs.recommended,
});

const eslintConfig = [
  // Add the base ESLint recommended rules
  { linterOptions: { reportUnusedDisableDirectives: true } },

  // Use the compatibility layer to load Next.js and TypeScript configurations
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ),

  // Add specific settings for consistency
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Add any custom rules here
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;
