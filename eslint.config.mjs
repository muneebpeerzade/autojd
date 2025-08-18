import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Keep Next.js defaults
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Override / disable rules
  {
    rules: {
      // React Hooks
      "react-hooks/exhaustive-deps": "off",

      // TypeScript
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      // Style
      "prefer-const": "off",

      // Accessibility
      "jsx-a11y/role-supports-aria-props": "off",

      // Next.js warnings
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
