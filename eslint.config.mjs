import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
});

export default [
  { ignores: [".next/**", "node_modules/**"] },
  ...compat.extends("next/core-web-vitals"),
];
